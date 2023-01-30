export enum Chain {
    ETH = "ETH",
    BSC = "BSC",
    SOL = "SOL",
}

export interface ResolverModel {
    getAliasAddresses(alias: string): string[];
    
    getAddressAliases(address: string, chain: Chain): string[];
}
