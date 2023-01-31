import { ResolverService } from "@/services/resolvers/resolver.service";

export enum Chain {
    ETH = "ETH",
    BSC = "BSC",
    SOL = "SOL",
}

export interface ResolverModel {
    options: ResolverOptions;

    getAddresses(alias: string): Promise<string[]>;

    getAliases(address: string, chain: Chain): Promise<string[]>;
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
