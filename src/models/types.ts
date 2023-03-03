import type { ResolverService, ResolverServiceOptions } from "@resolver/services/resolvers/resolver.service";

export type ResolverVendor = "redefined" | "ens" | "unstoppable" | string

export type NodeNetwork = "eth" | "arbitrum" | "polygon";

export type Nodes = {
    [key in NodeNetwork]: string
}

export type ResolverOptions = {
    defaultResolvers?: ResolverVendor[],
    useDefaultResolvers?: boolean,
    nodes?: { [key in NodeNetwork]?: string }
    allowDefaultEvmResolves?: boolean,
    customResolvers?: ResolverService[],
}

export type Account = {
    address: string,
    network: string,
    from: ResolverVendor,
}

export type AccountRecord = {
    addr: string,
    network: string,
}

export type CustomResolverServiceOptions = ResolverServiceOptions | {
    [key: string]: any,
}

export interface Resolver {
    options?: ResolverOptions;

    resolve(domain: string, networks?: string[], options?: CustomResolverServiceOptions): Promise<Account[]>;
}
