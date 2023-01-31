export enum Chain {
    ETH = "ETH",
    BSC = "BSC",
    ZIL = "ZIL",
    SOL = "SOL",
}

export interface ResolverModel {
    options: ResolverOptions;

    getAddresses(domain: string, chain: Chain): Promise<string[]>;

    getDomains(address: string, chain: Chain): Promise<string[]>;
}

export type SetAddressOptions = {
    from: string,
    gasPrice?: string,
    gas?: string,
}

export enum ResolverServices {
    REDEFINED = "REDEFINED",
    ENS = "ENS",
    UNSTOPPABLE = "UNSTOPPABLE",
}

export type ResolverOptions = {
    // by default, we use all services
    usedServices?: ResolverServices[],
}
