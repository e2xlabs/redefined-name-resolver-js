import type { Nodes, Account, Network } from "@resolver/models/types";
import { flatten } from "lodash";

export abstract class ResolverService {

    abstract resolve(domain: string, network: Network, nodeLink: string): Promise<Account[]>;

    async resolveAll(domain: string, nodes: Nodes): Promise<Account[]> {
        const serviceNodes = Object.entries(nodes).map(([network, node]) => ({ network, node }));
        return flatten(await Promise.all(serviceNodes.map(it => this.resolve(domain, it.network as Network, it.node!))));
    }
}
