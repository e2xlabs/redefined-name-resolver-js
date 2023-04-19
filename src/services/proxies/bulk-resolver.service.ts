import { ResolverService } from "@resolver/services/resolvers/resolver.service";
import { Account, CustomResolverServiceOptions, ResolverVendor } from "@resolver/models/types";

export class BulkProxy<C extends any, R extends ResolverService> implements ResolverService {

  private readonly configuredResolvers: R[] = [];

  constructor(configs: C[] | undefined, instanceRef: (config: C | undefined) => R) {
    this.configuredResolvers = configs?.map(n => instanceRef(n)) || [];
    this.configuredResolvers.push(instanceRef(undefined));
    this.vendor = this.configuredResolvers[0].vendor;
  }

  readonly vendor: ResolverVendor = "";

  async resolve(domain: string, networks?: string[], options?: CustomResolverServiceOptions): Promise<Account[]> {
    let lastError: any;
    for (let resolver of this.configuredResolvers) {
      try {
        return await resolver.resolve(domain, networks, options);
      } catch (e: any) {
        lastError = e;
      }
    }
    throw lastError
  }
}