import type { ResolverService, ResolverServiceOptions } from "@resolver/services/resolvers/resolver.service";

export type ResolverVendor = "redefined" | "ens" | "unstoppable" | string

export type NodeNetwork = "redefinedNode" | "ensNode" | "unsMainnetNode" | "unsPolygonMainnetNode";

export type NodeOptions = {
    [key in NodeNetwork]?: string
}

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

export interface Resolver {

    resolve(domain: string, networks?: string[], options?: CustomResolverServiceOptions): Promise<Account[]>;
}


export type EnsParams = { node: string };

export type UnstoppableParams = { mainnetNode?: string, polygonMainnetNode?: string };

export type RedefinedParams = { node?: string, allowDefaultEvmResolves?: boolean };

export type ResolversParams = {
    redefined?: RedefinedParams,
    unstoppable?: UnstoppableParams,
    ens?: EnsParams,
}
