import { Type, Expose } from "class-transformer";

export interface IRPCProvider {
  name: string;
  url: string;
  coreApi: string;
}


export class CustomRPCProvider implements IRPCProvider {
  @Type()
  public name: string = '';;
  @Type()
  public url: string = '';
  @Expose({ name: 'coreApi' })
  @Type()
  public get coreApi() {
    return this.url;
  }
}
