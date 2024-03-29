import type { ResolverService } from "@resolver/services/resolvers/resolver.service";

export type ResolverVendor = "redefined-username" | "redefined-email" | "ens" | "unstoppable" | "lens" | "bonfida" | "sid" | string

export type ResolverOptions = {
    resolvers: ResolverService[]
}

export type Account = {
    address: string,
    network: string,
    from: ResolverVendor,
}

export type ReverseAccount = {
    domain: string,
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

export type ResolverReverseResponse = {
    response: ReverseAccount[],
    errors:  ResolverServiceError[],
}

export type EnsParams = { node: string };

export type UnstoppableParams = { mainnetNode?: string, polygonMainnetNode?: string };

export type RedefinedParams = { node?: string, allowDefaultEvmResolves?: boolean };

export type SidParams = { bscNode: string, arbitrumOneNode: string };

export type BonfidaParams = { cluster: string };

export type LensParams = { apiUrl: string };

export type ResolversParams = {
    redefined?: RedefinedParams[],
    unstoppable?: UnstoppableParams[],
    ens?: EnsParams[],
    sid?: SidParams[],
    bonfida?: BonfidaParams[],
    lens?: LensParams[]
}

export enum SidChainId {
    BSC = "56",
    ARB = "42161"
}

export enum SidResolverData {
    ARB1 = "ARB1",
    ARB_NOVA = "ARB_NOVA"
}
