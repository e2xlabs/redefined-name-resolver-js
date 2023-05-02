import { ResolverService } from "@resolver/services/resolvers/resolver.service";
import { Account, CustomResolverServiceOptions, ResolverVendor } from "@resolver/models/types";

export class BulkProxy<C extends any, R extends ResolverService> implements ResolverService {

  readonly vendor: ResolverVendor = "";

  private readonly configuredResolvers: R[] = [];

  private readonly allowableErrorMessages = [
    "Cant resolve",
    "Invalid characters, allowed only lowercase alphanumeric and -_",
    "is not registered",
    "is invalid",
    "is not supported",
    "Invalid name",
    "Incorrect domain",
    "No records found for domain",
    "Name has incorrect length",
    "Name should be at least 4 characters",
    "Name should be at most 63 characters",
    "Name should start with a letter"
  ]

  constructor(configs: C[] | undefined, instanceRef: (config: C | undefined) => R) {
    this.configuredResolvers = configs?.map(n => instanceRef(n)) || [];
    this.configuredResolvers.push(instanceRef(undefined));
    this.vendor = this.configuredResolvers[0].vendor;
  }

  async resolve(domain: string, networks?: string[], options?: CustomResolverServiceOptions): Promise<Account[]> {
    let lastError: any;
    for (let resolver of this.configuredResolvers) {
      try {
        return await resolver.resolve(domain, networks, options);
      } catch (e: any) {
        if (this.allowableErrorMessages.some(msg => e.message.includes(msg))) {
          throw e;
        }
        lastError = e;
      }
    }
    throw lastError
  }
}