import type { Account, CustomResolverServiceOptions, ResolverVendor } from "@resolver/models/types";


export abstract class ResolverService {

    abstract readonly vendor: ResolverVendor;

    abstract resolve(domain: string, networks?: string[], options?: CustomResolverServiceOptions): Promise<Account[]>;
}
