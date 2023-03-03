import type { ResolverService, ResolverServiceOptions } from "@resolver/services/resolvers/resolver.service";
import { UnstoppableResolverService } from "@resolver/services/resolvers/unstoppable-resolver.service";
import { EnsResolverService } from "@resolver/services/resolvers/ens-resolver.service";
import { RedefinedResolverService } from "@resolver/services/resolvers/redefined-resolver.service";

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

export type CreateResolverOptions = {
    nodes?: NodeOptions,
    allowDefaultEvmResolves?: boolean,
}

export interface Resolver {

    resolve(domain: string, networks?: string[], options?: CustomResolverServiceOptions): Promise<Account[]>;
}
