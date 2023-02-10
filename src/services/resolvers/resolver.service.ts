import type { Nodes, Account,Network } from "@resolver/models/types";
import { flatten } from "lodash";

export abstract class ResolverService {

    abstract supportedNetworks: Network[]

    abstract resolve(domain: string, network: Network, nodeLink: string): Promise<Account[]>;
    
    isSupportedNetwork(network: Network) {
        return this.supportedNetworks.some(it => it === network);
    }

    async resolveAll(domain: string, nodes: Nodes): Promise<Account[]> {
        const serviceNodes = this.supportedNetworks.map(it => ({ network: it, node: nodes[it] }));
        return flatten(await Promise.all(serviceNodes.map(it => this.resolve(domain, it.network, it.node!))));
    }
}
