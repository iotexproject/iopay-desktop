import { notification } from "antd";
import BigNumber from "bignumber.js";
import { plainToClass, Type } from "class-transformer";
import ethereumjs from "ethereumjs-abi";
import { Account } from "iotex-antenna/lib/account/account";
import { ExecutionMethod } from "iotex-antenna/lib/action/method";
import { AbiByFunc, getArgTypes, getHeaderHash } from "iotex-antenna/lib/contract/abi-to-byte";
import { Contract } from "iotex-antenna/lib/contract/contract";
import { fromBytes } from "iotex-antenna/lib/crypto/address";
import { IRpcMethod } from "iotex-antenna/lib/rpc-method/types";
import { ABI } from "../constants/abi";
import { GAS_LIMIT_MULTIPLIED_BY } from "../constants/transport";
import { DecodeData, IERC20 } from "../interfaces/erc20.interface";
import { IGasEstimation } from "../interfaces/gas-estimation.interface";
import { Method } from "../interfaces/method.interface";
import { getAntenna } from "../utils/get-antenna";

export class ERC20 implements IERC20 {
  @Type()
  public address: string = '';
  @Type(() => Contract)
  public contract!: Contract;
  @Type()
  public provider!: IRpcMethod;
  @Type()
  protected methods!: Record<string, Method>;

  public static create(address: string, provider: IRpcMethod, abi = ABI): ERC20 {
    const contract = plainToClass(Contract, new Contract(abi, address, { provider, signer: provider['signer'] }));
    const erc20 = plainToClass(ERC20, { ...new ERC20(), address, provider, contract });
    const methods = Reflect.ownKeys(erc20.contract.getABI() as AbiByFunc).reduce((acc, fnName) => {
      const fnAbi = (erc20.contract.getABI() as AbiByFunc).fnName;
      if (fnAbi.type !== "constructor") {
        const args = getArgTypes(fnAbi);
        const header = getHeaderHash(fnAbi, args);
        acc[header] = {
          name: fnName as string,
          inputsNames: args.map(i => `${i.name}`),
          inputsTypes: args.map(i => `${i.type}`),
        };
      }
      return acc;
    }, {} as Record<string, Method>);
    erc20.methods = methods;
    return erc20;
  }

  public async name(callerAddress: string) {
    const result = await this.readMethod("name", callerAddress);
    const data = ethereumjs.rawDecode(["string"], Buffer.from(result, "hex"));
    if (data.length > 0) {
      return data[0];
    }
    return "";
  }

  public async symbol(callerAddress: string) {
    const result = await this.readMethod("symbol", callerAddress);
    const data = ethereumjs.rawDecode(["string"], Buffer.from(result, "hex"));
    if (data.length > 0) {
      return data[0];
    }
    return "";
  }

  public async decimals(callerAddress: string) {
    const result = await this.readMethod("decimals", callerAddress);
    return new BigNumber(result, 16);
  }

  public async totalSupply(callerAddress: string) {
    const result = await this.readMethod("totalSupply", callerAddress);
    return new BigNumber(result, 16);
  }

  public async balanceOf(
    owner: string,
    callerAddress: string
  ) {
    const result = await this.readMethod("balanceOf", callerAddress, owner);
    return new BigNumber(result, 16);
  }

  public async transfer(
    to: string,
    value: BigNumber,
    account: Account,
    gasPrice: string,
    gasLimit: string
  ) {
    return this.executeMethod(
      "transfer",
      account,
      gasPrice,
      gasLimit,
      "0",
      to,
      value.toFixed(0)
    );
  }

  public async allowance(
    owner: string,
    spender: string,
    account: Account,
    gasPrice: string,
    gasLimit: string
  ) {
    return this.executeMethod(
      "allowance",
      account,
      gasPrice,
      gasLimit,
      "0",
      owner,
      spender
    );
  }

  public async approve(
    spender: string,
    value: BigNumber,
    account: Account,
    gasPrice: string,
    gasLimit: string
  ) {
    return this.executeMethod(
      "approve",
      account,
      gasPrice,
      gasLimit,
      "0",
      spender,
      value.toString()
    );
  }

  public async transferFrom(
    from: string,
    to: string,
    value: BigNumber,
    account: Account,
    gasPrice: string,
    gasLimit: string
  ) {
    return this.executeMethod(
      "transferFrom",
      account,
      gasPrice,
      gasLimit,
      "0",
      from,
      to,
      value.toString()
    );
  }

  public async readMethod(
    method: string,
    callerAddress: string,
    ...args
  ) {
    const result = await this.provider.readContract({
      execution: this.contract.pureEncodeMethod("0", method, ...args),
      callerAddress: callerAddress
    });

    return result.data;
  }

  public async executeMethod(
    method: string,
    account: Account,
    gasPrice: string,
    gasLimit: string,
    amount: string,
    ...args: Array<any>
  ) {
    try {
      const canExec = await this.canExecuteMethod(
        method,
        account,
        gasPrice,
        gasLimit,
        amount,
        ...args
      );
      if (!canExec) {
        return "";
      }
    } catch (error) {
      notification.error({
        message: `${error.message}`
      });
      return "";
    }
    // Needed for debug purpose.
    window.console.log(`executeMethod`, {
      method,
      account: { ...account, privateKey: "****" },
      gasPrice,
      gasLimit,
      amount,
      args
    });
    return this.contract.methods[method](...args, {
      account: account,
      amount: amount,
      gasLimit: gasLimit,
      gasPrice: gasPrice
    });
  }

  public async canExecuteMethod(
    method: string,
    account: Account,
    gasPrice: string,
    gasLimit: string,
    amount: string,
    ...args: Array<any>
  ) {
    const estimateGas = await this.estimateExecutionGas(
      method,
      account,
      amount, // Amount here is in RAU unit
      ...args
    );
    const gasNeeded = new BigNumber(estimateGas.gasLimit).multipliedBy(
      new BigNumber(estimateGas.gasPrice)
    );
    const gasInput = new BigNumber(gasLimit).multipliedBy(
      new BigNumber(gasPrice)
    );
    if (gasInput.isLessThan(gasNeeded)) {
      throw new Error("erc20.execution.error.lowGasInput");
    }
    const { accountMeta } = await getAntenna().iotx.getAccount({
      address: account['address']
    });
    if (!accountMeta) {
      throw new Error("erc20.execution.error.notEnoughBalance");
    }

    const requireAmount = new BigNumber(amount).plus(gasNeeded);
    const availableBalance = new BigNumber(accountMeta.balance);
    if (availableBalance.isLessThan(requireAmount)) {
      throw new Error("erc20.execution.error.notEnoughBalance");
    }
    return true;
  }

  public async estimateExecutionGas(
    method: string,
    account: Account,
    amount: string,
    ...args: Array<any>
  ) {
    const execution = this.contract.pureEncodeMethod(amount, method, ...args);
    const executionMethod = new ExecutionMethod(
      getAntenna().iotx,
      account,
      execution
    );
    const { gasPrice } = await getAntenna().iotx.suggestGasPrice({});
    const envelop = await executionMethod.baseEnvelop("100000", `${gasPrice}`);
    envelop.execution = execution;

    let gasLimit = "400000";
    try {
      const { gas } = await getAntenna().iotx.estimateActionGasConsumption({
        transfer: envelop.transfer,
        execution: envelop.execution,
        callerAddress: account.address
      });
      gasLimit = new BigNumber(gas)
        .multipliedBy(GAS_LIMIT_MULTIPLIED_BY)
        .toFixed(0);
    } catch (e) {
      window.console.log("estimateGasForAction failed!");
    }

    return {
      gasPrice: `${gasPrice}`,
      gasLimit
    } as IGasEstimation;
  }

  public decode(data: string): DecodeData {
    if (data.length < 8) {
      throw new Error("input data error");
    }
    const methodKey = data.substr(0, 8);
    const method = this.methods[methodKey];
    if (!method) {
      throw new Error(`method ${methodKey} is not erc20 method`);
    }
    const params = ethereumjs.rawDecode(
      method.inputsTypes,
      Buffer.from(data.substring(8), "hex")
    );
    const values = {};

    for (let i = 0; i < method.inputsTypes.length; i++) {
      if (method.inputsTypes[i] === "address") {
        params[i] = fromBytes(
          Buffer.from(params[i].toString(), "hex")
        ).string();
      }
      values[method.inputsNames[i]] = params[i];
    }

    return {
      method: method.name,
      data: values
    };
  }
}
