import type { Nodes, Account,Network } from "@resolver/models/types";
import { flatten } from "lodash";

export abstract class ResolverService {

    abstract getSupportedNetworks(): Network[]

    abstract resolve(domain: string, network: Network, nodeLink: string): Promise<Account[]>;

    async resolveAll(domain: string, nodes: Nodes): Promise<Account[]> {
        const serviceNodes = this.getSupportedNetworks().map(it => ({ network: it, node: nodes[it] }));
        return flatten(await Promise.all(serviceNodes.map(it => this.resolve(domain, it.network, it.node!))));
    }
}
