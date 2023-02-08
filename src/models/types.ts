export type Network = "eth" | "bsc" | "sol" | "zil";

export type ResolverServices = "redefined" | "ens" | "unstoppable"

export type Nodes = {
    [key in Network]?: string
}

export type ResolverOptions = {
    // by default, we use all services
    resolverServices?: ResolverServices[],
    nodes?: Nodes
}

export type Account = {
    address: string,
    network: Network,
    from: ResolverServices,
}

export type AccountRecord = {
    addr: string,
    network: Network,
}

export type RedefinedReverse = {
    version: number,
    data: string,
}

export declare interface Resolver {
    options?: ResolverOptions;

    resolve(domain: string, networks?: Network[]): Promise<Account[]>;
}
