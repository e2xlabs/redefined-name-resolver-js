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

export type SetAddressOptions = {
    from: string,
    gasPrice?: string,
    gas?: string,
}


export type ResolvedAddress = {
    address: string,
    network: Network,
}

export interface Resolver {
    options?: ResolverOptions;

    resolve(domain: string, network: Network): Promise<ResolvedAddress[]>;

    reverse(address: string, network: Network): Promise<string[]>;

    register(domain: string, options: SetAddressOptions): Promise<any>;
}
