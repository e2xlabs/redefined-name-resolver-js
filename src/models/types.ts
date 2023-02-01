export enum Network {
    ETH = "ETH",
    BSC = "BSC",
    SOL = "SOL",
    ZIL = "ZIL",
}

export enum ResolverServices {
    REDEFINED = "REDEFINED",
    ENS = "ENS",
    UNSTOPPABLE = "UNSTOPPABLE",
}

export type ResolverOptions = {
    // by default, we use all services
    resolverServices?: ResolverServices[],
}

export type Account = {
    address: string,
    network: Network,
}

export type Revers = {
    version: number,
    data: string,
}

export interface Resolver {
    options?: ResolverOptions;

    resolve(domain: string, network: Network): Promise<Account[]>;

    reverse(): Promise<Revers[]>;
    
    register(domainHash: string, redefinedSign: string, records: Account[], newRevers: Revers[]): Promise<void>;
    
    update(domainHash: string, records: Account[]): Promise<void>;
}
