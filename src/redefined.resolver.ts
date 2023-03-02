import type { Account, Resolver } from "@resolver/models/types";
import type { ResolverOptions, ResolverName, Nodes } from "@resolver/models/types";
import type { ResolverService } from "@resolver/services/resolvers/resolver.service";
import { RedefinedUsernameResolverService } from "@resolver/services/resolvers/redefined-username-resolver.service";
import { RedefinedEmailResolverService } from "@resolver/services/resolvers/redefined-email-resolver.service";
import { EnsResolverService } from "@resolver/services/resolvers/ens-resolver.service";
import { UnstoppableResolverService } from "@resolver/services/resolvers/unstoppable-resolver.service";
import { flatten } from "lodash";
import config from "@resolver/config";

export class RedefinedResolver implements Resolver {

    private resolverNames: ResolverName[] = ["redefined", "ens", "unstoppable"];

    private allowDefaultEvmResolves = true;

    private resolvers: ResolverService[];

    private nodes: Nodes = {
        arbitrum: config.ARBITRUM_NODE,
        eth: config.ETH_NODE,
        polygon: config.POLYGON_NODE,
    };

    constructor(
      public options?: ResolverOptions
    ) {
        const resolverNames = this.options?.resolverNames;
        const nodes = this.options?.nodes;
        const allowDefaultEvmResolves = this.options?.allowDefaultEvmResolves;
        const customResolvers = this.options?.customResolvers;

        if (resolverNames && !resolverNames.length) {
            throw Error("“resolverServices” option must be a non-empty array or falsy")
        }

        if (nodes && !Object.keys(nodes).length) {
            throw Error("“nodes” option must be a non-empty object or falsy")
        }

        if (customResolvers && !customResolvers.length) {
            throw Error("“customResolvers” option must be a non-empty array or falsy")
        }

        if (resolverNames) {
            this.resolverNames = resolverNames;
        }

        if (nodes) {
            this.nodes = { ...this.nodes, ...nodes };
        }

        if (allowDefaultEvmResolves !== undefined) {
            this.allowDefaultEvmResolves = allowDefaultEvmResolves;
        }

        this.resolvers = this.createResolvers();

        if (customResolvers) {
            this.resolvers.push(...customResolvers);
        }
    }

    async resolve(domain: string, networks?: string[]): Promise<Account[]> {
        return flatten(
          await Promise.all(this.resolvers.map(it => it.resolve(domain, { throwErrorOnInvalidDomain: false }, networks)))
        ).filter(it => !networks || networks.includes(it.network) || it.network === "evm")
    }

    private createResolvers(): ResolverService[] {
        const resolvers: ResolverService[] = [
            new RedefinedUsernameResolverService(this.nodes.arbitrum, this.allowDefaultEvmResolves),
            new RedefinedEmailResolverService(this.nodes.arbitrum, this.allowDefaultEvmResolves),
            new EnsResolverService(this.nodes.eth),
            new UnstoppableResolverService({ eth: this.nodes.eth, polygon: this.nodes.polygon }),
        ]

        return resolvers.filter(it => this.resolverNames.includes(it.vendor));
    }
}
