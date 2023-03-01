export type ResolverServices = "redefined" | "ens" | "unstoppable"

export type NodeNetwork = "eth" | "arbitrum" | "polygon";

export type Nodes = {
    [key in NodeNetwork]: string
}

export type ResolverOptions = {
    resolverServices?: ResolverServices[],
    nodes?: { [key in NodeNetwork]?: string }
    allowDefaultEvmResolves?: boolean
}

export type Account = {
    address: string,
    network: string,
    from: ResolverServices,
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
