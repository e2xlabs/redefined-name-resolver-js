import type { Account, Resolver } from "@resolver/models/types";
import type { Network, ResolverOptions, ResolverServices, Nodes } from "@resolver/models/types";
import type { ResolverService } from "@resolver/services/resolvers/resolver.service";
import { RedefinedUsernameResolverService } from "@resolver/services/resolvers/redefined-username-resolver.service";
import { RedefinedEmailResolverService } from "@resolver/services/resolvers/redefined-email-resolver.service";
import { EnsResolverService } from "@resolver/services/resolvers/ens-resolver.service";
import { UnstoppableResolverService } from "@resolver/services/resolvers/unstoppable-resolver.service";
import { flatten } from "lodash";
import config from "@resolver/config";
import { RequestedNetwork } from "@resolver/models/types";

export class RedefinedResolver implements Resolver {

    private resolverServices: ResolverServices[] = ["redefined", "ens", "unstoppable"];

    private allowDefaultEvmResolves: boolean = true;

    private resolvers: ResolverService[];

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
        const allowDefaultEvmResolves = this.options?.allowDefaultEvmResolves;

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

        if (allowDefaultEvmResolves !== undefined) {
            this.allowDefaultEvmResolves = allowDefaultEvmResolves;
        }

        this.resolvers = this.createResolvers(this.nodes, this.resolverServices, this.allowDefaultEvmResolves);
    }

    async resolve(domain: string, networks?: RequestedNetwork[]): Promise<Account[]> {
        return flatten(
          await Promise.all(this.resolvers
              .filter(it => !networks || it.allNetworksSupported || networks.includes(it.network as RequestedNetwork))
              .map(it => it.resolve(domain, networks)))
          )
        ;
    }

    private createResolvers(nodes: Nodes, resolverNames: ResolverServices[], allowDefaultEvmResolves: boolean): ResolverService[] {
        const resolvers: ResolverService[] = [
            new RedefinedUsernameResolverService(nodes.arbitrum, "arbitrum", allowDefaultEvmResolves),
            new RedefinedEmailResolverService(nodes.arbitrum, "arbitrum", allowDefaultEvmResolves),

            new EnsResolverService(nodes.eth, "eth"),
            new EnsResolverService(nodes.bsc, "bsc"),

            new UnstoppableResolverService(nodes.eth, "eth"),
            new UnstoppableResolverService(nodes.bsc, "bsc"),
            new UnstoppableResolverService(nodes.zil, "zil"),
        ]

        return resolvers.filter(it => resolverNames.includes(it.vendor));
    }
}
