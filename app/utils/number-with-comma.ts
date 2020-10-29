import BN from "bignumber.js";
import numeral from "numeral";

type Option = { decimals?: number; format?: string };
export const numberWithCommas = (n: string): string => {
  return n
    .toString()
    .replace(/\,/g, "")
    .split(".")
    .map((part, index) =>
      index === 0 ? part.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : part
    )
    .join(".");
}

export const numberFromCommaString = (n: string): string => {
  if (!n) {
    return n;
  }
  return n.toString().replace(/\,/g, "");
}

export const hexToBytes = (hexStr: string): Array<number> => {
  const matches = hexStr.match(/^(0x)?([0-9a-fA-F]*)$/);
  if (!matches || matches.length < 3) {
    throw new Error(`Given value "${hexStr}" is not a valid hex string.`);
  }

  const hex = matches[2].length % 2 ? `0${matches[2]}` : matches[2];

  const bytes = [];
  for (let c = 0; c < hex.length; c += 2) {
    bytes.push(parseInt(hex.substr(c, 2), 16));
  }

  return bytes;
}
const countNonZeroNumbers = (str: string) => {
  let index = 0;
  length = str.length;
  for (
    ;
    index < length && (str[index] === "0" || str[index] === ".");
    index += 1
  );
  return length - index - Number(str.includes("."));
};
export const toPrecisionFloor = (
  str: number | string,
  options: Option = { decimals: 6, format: "" }
) => {
  const { decimals, format } = options;
  if (!str || isNaN(Number(str))) {
    return "";
  }
  if (countNonZeroNumbers(String(str)) <= Number(decimals)) {
    return String(str);
  }
  const numStr = new BN(str).toFixed();
  let result = "";
  let index = 0;
  const numLength = numStr.length;

  // tslint:disable-next-line:curly
  for (; numStr[index] === "0" && index < numLength; index += 1);

  if (index === numLength) {
    return "0";
  }

  if (numStr[index] === ".") {
    // number < 0
    result = "0";
    for (
      ;
      (numStr[index] === "0" || numStr[index] === ".") && index < numLength;
      index += 1
    ) {
      result = result + numStr[index];
    }
  }
  let resultNumLength = 0;
  for (
    ;
    index < numLength &&
    (resultNumLength < Number(decimals) || !result.includes("."));
    index += 1
  ) {
    result = result + numStr[index];

    if (numStr[index] !== ".") {
      resultNumLength += 1;
    }
  }
  if (format) {
    return numeral(Number(result)).format(format);
  }

  return new BN(result).toFixed();
};
