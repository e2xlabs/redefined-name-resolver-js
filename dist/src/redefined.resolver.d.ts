import type { Account, Resolver } from "./models/types";
import type { Network, ResolverOptions } from "./models/types";
export declare class RedefinedResolver implements Resolver {
    options?: ResolverOptions | undefined;
    private resolverServices;
    private nodes;
    constructor(options?: ResolverOptions | undefined);
    resolve(domain: string, networks?: Network[]): Promise<Account[]>;
}
