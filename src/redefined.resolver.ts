import type { Account, Resolver } from "@resolver/models/types";
import type { ResolverOptions, ResolverVendor, Nodes } from "@resolver/models/types";
import type { ResolverService } from "@resolver/services/resolvers/resolver.service";
import { RedefinedUsernameResolverService } from "@resolver/services/resolvers/redefined-username-resolver.service";
import { RedefinedEmailResolverService } from "@resolver/services/resolvers/redefined-email-resolver.service";
import { EnsResolverService } from "@resolver/services/resolvers/ens-resolver.service";
import { UnstoppableResolverService } from "@resolver/services/resolvers/unstoppable-resolver.service";
import { flatten } from "lodash";
import config from "@resolver/config";
import { CustomResolverServiceOptions } from "@resolver/models/types";

export class RedefinedResolver implements Resolver {

    private defaultResolverVendors: ResolverVendor[] = ["redefined", "ens", "unstoppable"];

    private allowDefaultEvmResolves = true;

    private useDefaultResolvers = true;

    private resolvers: ResolverService[];

    private nodes: Nodes = {
        redefinedNode: config.REDEFINED_NODE,
        ensNode: config.ENS_NODE,
        unsMainnetNode: config.UNS_MAINNET_NODE,
        unsPolygonMainnetNode: config.UNS_POLYGON_MAINNET_NODE,
    };

    constructor(
      public options?: ResolverOptions
    ) {
        const defaultResolverVendors = this.options?.defaultResolvers;
        const nodes = this.options?.nodes;
        const allowDefaultEvmResolves = this.options?.allowDefaultEvmResolves;
        const customResolvers = this.options?.customResolvers;
        const useDefaultResolvers = this.options?.useDefaultResolvers;

        if (useDefaultResolvers !== undefined) {
            this.useDefaultResolvers = useDefaultResolvers;
        }

        if (defaultResolverVendors) {
            if (!defaultResolverVendors.length) {
                throw Error("“defaultResolvers” option must be a non-empty array or falsy");
            }

            if (!this.useDefaultResolvers) {
                console.warn("You have chosen not to use the default resolvers, but you have specified them!");
            }

            this.defaultResolverVendors = defaultResolverVendors;
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
            ? this.getDefaultResolvers().filter(it => this.defaultResolverVendors.includes(it.vendor))
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

    async resolve(domain: string, networks?: string[], options?: CustomResolverServiceOptions): Promise<Account[]> {
        const customOptions = options || {};
        // throwErrorOnInvalidDomain - non-rewritable parameter
        // If it is true, then everything will fall on an error in one resolver
        return flatten(
          await Promise.all(this.resolvers.map(it => it.resolve(domain, { ...customOptions, throwErrorOnInvalidDomain: false }, networks)))
        ).filter(it => !networks || networks.includes(it.network) || it.network === "evm")
    }

    private getDefaultResolvers(): ResolverService[] {
        return [
            new RedefinedUsernameResolverService(this.nodes.redefinedNode, this.allowDefaultEvmResolves),
            new RedefinedEmailResolverService(this.nodes.redefinedNode, this.allowDefaultEvmResolves),
            new EnsResolverService(this.nodes.ensNode),
            new UnstoppableResolverService({ mainnet: this.nodes.unsMainnetNode, polygonMainnet: this.nodes.unsPolygonMainnetNode }),
        ]
    }
}
