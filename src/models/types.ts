import type { ResolverService } from "@resolver/services/resolvers/resolver.service";

export type ResolverVendor = "redefined-username" | "redefined-email" | "ens" | "unstoppable" | string

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

export type CustomResolverServiceOptions = {
    [key: string]: any,
}

export type ResolverServiceError = {
    vendor: ResolverVendor,
    error: string
}

export type ResolverResponse = {
    response: Account[],
    errors:  ResolverServiceError[],
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
