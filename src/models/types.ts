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
}

export type RedefinedRevers = {
    version: number,
    data: string,
}

export interface Resolver {
    options?: ResolverOptions;

    resolve(domain: string, network: Network): Promise<Account[]>;

    reverse(): Promise<string[]>;
    
    register(domainHash: string, redefinedSign: string, records: Account[], newRevers: RedefinedRevers[]): Promise<void>;
    
    update(domainHash: string, records: Account[]): Promise<void>;
}
