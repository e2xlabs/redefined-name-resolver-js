import type { ResolverService, ResolverServiceOptions } from "@resolver/services/resolvers/resolver.service";
import { UnstoppableResolverService } from "@resolver/services/resolvers/unstoppable-resolver.service";
import { EnsResolverService } from "@resolver/services/resolvers/ens-resolver.service";
import { RedefinedResolverService } from "@resolver/services/resolvers/redefined-resolver.service";

export type ResolverVendor = "redefined" | "ens" | "unstoppable" | string

export type NodeNetwork = "redefinedNode" | "ensNode" | "unsMainnetNode" | "unsPolygonMainnetNode";

export type Nodes = {
    [key in NodeNetwork]: string
}

export type NodeOptions = {
    [key in NodeNetwork]?: string
}

export type ResolverOptions = {
    nodes?: NodeOptions
    allowDefaultEvmResolves?: boolean,
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
    
    setResolvers(resolvers: ResolverService[]): void
    
    getDefaultResolvers(): ResolverService[];
    
    getRedefinedResolvers(): RedefinedResolverService[];
    
    getRedefinedEmailResolver(): RedefinedResolverService;
    
    getRedefinedUsernameResolver(): RedefinedResolverService;
    
    getEnsResolver(): EnsResolverService;
    
    getUnstoppableResolver(): UnstoppableResolverService;
}
