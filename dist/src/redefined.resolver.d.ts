import type { Account, Resolver } from "@resolver/models/types";
import type { Network, ResolverOptions } from "@resolver/models/types";
export declare class RedefinedResolver implements Resolver {
    options?: ResolverOptions | undefined;
    private resolverServices;
    private nodes;
    constructor(options?: ResolverOptions | undefined);
    resolve(domain: string, networks?: Network[]): Promise<Account[]>;
}
