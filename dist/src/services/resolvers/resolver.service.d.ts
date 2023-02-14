import type { Nodes, Account, Network } from "../../models/types";
export declare abstract class ResolverService {
    abstract supportedNetworks: Network[];
    abstract resolve(domain: string, network: Network, nodeLink: string): Promise<Account[]>;
    isSupportedNetwork(network: Network): boolean;
    resolveAll(domain: string, nodes: Nodes): Promise<Account[]>;
}
