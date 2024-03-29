import { ResolverService } from "@resolver/services/resolvers/resolver.service";
import { Account, CustomResolverServiceOptions, ReverseAccount } from "@resolver/models/types";

export class CustomResolver extends ResolverService {
  vendor = "some-custom-resolver"

  async resolve(domain: string, networks?: string[], options?: CustomResolverServiceOptions): Promise<Account[]> {
    return [{
      address: "0x123",
      network: "eth",
      from: this.vendor,
    }]
  }

  async reverse(domain: string): Promise<ReverseAccount[]> {
    return [{
      domain: "0x123",
      from: this.vendor,
    }]
  }
}
