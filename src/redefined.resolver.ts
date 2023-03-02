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

    private defaultResolverNames: ResolverName[] = ["redefined", "ens", "unstoppable"];

    private allowDefaultEvmResolves = true;

    private useDefaultResolvers = true;

    private resolvers: ResolverService[] = [];

    private nodes: Nodes = {
        arbitrum: config.ARBITRUM_NODE,
        eth: config.ETH_NODE,
        polygon: config.POLYGON_NODE,
    };

    constructor(
      public options?: ResolverOptions
    ) {
        this.prepareOptions();
    }

    async resolve(domain: string, networks?: string[]): Promise<Account[]> {
        return flatten(
          await Promise.all(this.resolvers.map(it => it.resolve(domain, { throwErrorOnInvalidDomain: false }, networks)))
        ).filter(it => !networks || networks.includes(it.network) || it.network === "evm")
    }

    private getDefaultResolvers(): ResolverService[] {
        return [
            new RedefinedUsernameResolverService(this.nodes.arbitrum, this.allowDefaultEvmResolves),
            new RedefinedEmailResolverService(this.nodes.arbitrum, this.allowDefaultEvmResolves),
            new EnsResolverService(this.nodes.eth),
            new UnstoppableResolverService({ eth: this.nodes.eth, polygon: this.nodes.polygon }),
        ]
    }

    private prepareOptions() {
        const defaultResolverNames = this.options?.defaultResolvers;
        const nodes = this.options?.nodes;
        const allowDefaultEvmResolves = this.options?.allowDefaultEvmResolves;
        const customResolvers = this.options?.customResolvers;
        const useDefaultResolvers = this.options?.useDefaultResolvers;

        if (useDefaultResolvers !== undefined) {
            this.useDefaultResolvers = useDefaultResolvers;
        }

        if (defaultResolverNames) {
            if (!defaultResolverNames.length) {
                throw Error("“resolverServices” option must be a non-empty array or falsy");
            }

            if (!this.useDefaultResolvers) {
                console.warn("You have chosen not to use the default resolvers, but you have specified them!");
            }

            this.defaultResolverNames = defaultResolverNames;
        }

        if (nodes) {
            if (!Object.keys(nodes).length) {
                throw Error("“nodes” option must be a non-empty object or falsy")
            }

            this.nodes = { ...this.nodes, ...nodes };
        }

        if (allowDefaultEvmResolves !== undefined) {
            this.allowDefaultEvmResolves = allowDefaultEvmResolves;
        }

        this.resolvers = this.useDefaultResolvers
          ? this.getDefaultResolvers().filter(it => this.defaultResolverNames.includes(it.vendor))
          : [];

        if (customResolvers) {
            if (!customResolvers.length) {
                throw Error("“customResolvers” option must be a non-empty array or falsy");
            }

            this.resolvers.push(...customResolvers);
        }

        if (!this.resolvers.length) {
            throw Error("No resolvers were added for your options!");
        }
    }
}
