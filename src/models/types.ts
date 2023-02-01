export enum Chain {
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

export type SetAddressOptions = {
    from: string,
    gasPrice?: string,
    gas?: string,
}

export interface Resolver {
    options?: ResolverOptions;

    resolve(domain: string, chain: Chain): Promise<string[]>;

    reverse(address: string, chain: Chain): Promise<string[]>;

    register(domain: string, options: SetAddressOptions): Promise<any>;
}
