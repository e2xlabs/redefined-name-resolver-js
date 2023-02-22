import type { Account, Resolver } from "@resolver/models/types";
import type { Network, ResolverOptions, ResolverServices, Nodes } from "@resolver/models/types";
import type { ResolverService } from "@resolver/services/resolvers/resolver.service";
import { RedefinedResolverService } from "@resolver/services/resolvers/redefined-resolver.service";
import { EnsResolverService } from "@resolver/services/resolvers/ens-resolver.service";
import { UnstoppableResolverService } from "@resolver/services/resolvers/unstoppable-resolver.service";
import { flatten } from "lodash";
import config from "@resolver/config";

export class RedefinedResolver implements Resolver {

    private resolverServices: ResolverServices[] = ["redefined", "ens", "unstoppable"];
    
    private resolvers: { [key in ResolverServices]: ResolverService[] };
    
    private nodes: Nodes = {
        arbitrum: config.ARBITRUM_NODE,
        eth: config.ETH_NODE,
        bsc: config.BSC_NODE,
        zil: config.ZIL_NODE,
    };

    constructor(
      public options?: ResolverOptions
    ) {
        const resolverServices = this.options?.resolverServices;
        const nodes = this.options?.nodes;

        if (resolverServices && !resolverServices.length) {
            throw Error("“resolverServices” option must be a non-empty array or falsy")
        }

        if (nodes && !Object.keys(nodes).length) {
            throw Error("“nodes” option must be a non-empty object or falsy")
        }

        if (resolverServices) {
            this.resolverServices = resolverServices;
        }

        if (nodes) {
            this.nodes = { ...this.nodes, ...nodes };
        }
        
        this.resolvers = this.createResolvers(this.nodes);
    }

    async resolve(domain: string, networks?: Network[]): Promise<Account[]> {
        const resolvers = flatten(this.resolverServices.map(name => this.resolvers[name]));
        
        return flatten(await Promise.all(resolvers.map(it => it.resolve(domain))))
            .filter(it => !networks || networks.includes(it.network));
    }
    
    private createResolvers(nodes: Nodes): { [key in ResolverServices]: ResolverService[] } {
        return {
            redefined: [
                new RedefinedResolverService(nodes.arbitrum, "arbitrum"),
            ],
            ens: [
                new EnsResolverService(nodes.eth, "eth"),
                new EnsResolverService(nodes.bsc, "bsc"),
            ],
            unstoppable: [
                new UnstoppableResolverService(nodes.eth, "eth"),
                new UnstoppableResolverService(nodes.bsc, "bsc"),
                new UnstoppableResolverService(nodes.zil, "zil"),
            ],
        }
    }
}
