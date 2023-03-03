import { ResolverService, ResolverServiceOptions } from "@resolver/services/resolvers/resolver.service";
import { Account } from "@resolver/models/types";

export class CustomResolver extends ResolverService {
  vendor = "some-custom-resolver"

  async resolve(domain: string, options?: ResolverServiceOptions, networks?: string[]): Promise<Account[]> {
    return [{
      address: "0x123",
      network: "eth",
      from: this.vendor,
    }]
  }
}
