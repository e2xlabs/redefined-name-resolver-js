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
    servicesToResolveDomains?: ResolverServices[],
}

export interface Resolver {
    options: ResolverOptions;

    getAddresses(domain: string, chain: Chain): Promise<string[]>;

    getDomains(address: string, chain: Chain): Promise<string[]>;

    setAddress(domain: string, options: SetAddressOptions): Promise<any>;
}

export type SetAddressOptions = {
    from: string,
    gasPrice?: string,
    gas?: string,
}
