import type { Account, CustomResolverServiceOptions, ResolverVendor, ReverseAccount } from "@resolver/models/types";


export abstract class ResolverService {

    abstract readonly vendor: ResolverVendor;

    abstract resolve(domain: string, networks?: string[], options?: CustomResolverServiceOptions): Promise<Account[]>;
    abstract reverse(address: string): Promise<ReverseAccount[]>;
}
