import type { ResolverService, ResolverServiceOptions } from "@resolver/services/resolvers/resolver.service";

export type ResolverVendor = "redefined" | "ens" | "unstoppable" | string

export type ResolverOptions = {
    resolvers: ResolverService[]
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

export type ResolverResponse = {
    response: Account[],
    errors:  { vendor: ResolverVendor, error: string }[],
}

export interface Resolver {

    resolve(domain: string, networks?: string[], options?: CustomResolverServiceOptions): Promise<ResolverResponse>;
}


export type EnsParams = { node: string };

export type UnstoppableParams = { mainnetNode?: string, polygonMainnetNode?: string };

export type RedefinedParams = { node?: string, allowDefaultEvmResolves?: boolean };

export type ResolversParams = {
    redefined?: RedefinedParams,
    unstoppable?: UnstoppableParams,
    ens?: EnsParams,
}
