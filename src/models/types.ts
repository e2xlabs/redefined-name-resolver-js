import { ResolverService } from "@resolver/services/resolvers/resolver.service";

export type ResolverName = "redefined" | "ens" | "unstoppable" | string

export type NodeNetwork = "eth" | "arbitrum" | "polygon";

export type Nodes = {
    [key in NodeNetwork]: string
}

export type ResolverOptions = {
    defaultResolvers?: ResolverName[],
    useDefaultResolvers?: boolean,
    nodes?: { [key in NodeNetwork]?: string }
    allowDefaultEvmResolves?: boolean,
    customResolvers?: ResolverService[],
}

export type Account = {
    address: string,
    network: string,
    from: ResolverName,
}

export type AccountRecord = {
    addr: string,
    network: string,
}

export type RedefinedReverse = {
    version: number,
    data: string,
}

export interface Resolver {
    options?: ResolverOptions;

    resolve(domain: string, networks?: string[]): Promise<Account[]>;
}
