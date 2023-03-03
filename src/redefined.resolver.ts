import type { Account, Resolver } from "@resolver/models/types";
import type { ResolverOptions, Nodes } from "@resolver/models/types";
import type { ResolverService } from "@resolver/services/resolvers/resolver.service";
import { RedefinedUsernameResolverService } from "@resolver/services/resolvers/redefined-username-resolver.service";
import { RedefinedEmailResolverService } from "@resolver/services/resolvers/redefined-email-resolver.service";
import { EnsResolverService } from "@resolver/services/resolvers/ens-resolver.service";
import { UnstoppableResolverService } from "@resolver/services/resolvers/unstoppable-resolver.service";
import { flatten } from "lodash";
import config from "@resolver/config";
import { CustomResolverServiceOptions } from "@resolver/models/types";

export class RedefinedResolver implements Resolver {

    private allowDefaultEvmResolves = true;

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
        const nodes = this.options?.nodes;
        const allowDefaultEvmResolves = this.options?.allowDefaultEvmResolves;

        if (nodes) {
            if (!Object.keys(nodes).length) {
                throw Error("“nodes” option must be a non-empty object or falsy")
            }

            this.nodes = { ...this.nodes, ...nodes };
        }

        if (allowDefaultEvmResolves !== undefined) {
            this.allowDefaultEvmResolves = allowDefaultEvmResolves;
        }

        this.resolvers = this.getDefaultResolvers();
    }

    async resolve(domain: string, networks?: string[], options?: CustomResolverServiceOptions): Promise<Account[]> {
        const customOptions = options || {};
        // throwErrorOnInvalidDomain - non-rewritable parameter
        // If it is true, then everything will fall on an error in one resolver
        return flatten(
          await Promise.all(this.resolvers.map(it => it.resolve(domain, { ...customOptions, throwErrorOnInvalidDomain: false }, networks)))
        ).filter(it => !networks || networks.includes(it.network) || it.network === "evm")
    }
    
    setResolvers(resolvers: ResolverService[]) {
        if (!resolvers.length) {
            throw Error("resolvers must be a non-empty array");
        }
    
        this.resolvers = resolvers;
    }
    
    getDefaultResolvers() {
        return [
            ...this.getRedefinedResolvers(),
            this.getEnsResolver(),
            this.getUnstoppableResolver(),
        ]
    }
    
    getRedefinedResolvers() {
        return [
            this.getRedefinedUsernameResolver(),
            this.getRedefinedEmailResolver(),
        ]
    }
    
    getRedefinedEmailResolver() {
        return new RedefinedEmailResolverService(this.nodes.redefinedNode, this.allowDefaultEvmResolves);
    }
    
    getRedefinedUsernameResolver() {
        return new RedefinedUsernameResolverService(this.nodes.redefinedNode, this.allowDefaultEvmResolves)
    }
    
    getEnsResolver() {
        return new EnsResolverService(this.nodes.ensNode);
    }
    
    getUnstoppableResolver() {
        return new UnstoppableResolverService({ mainnet: this.nodes.unsMainnetNode, polygonMainnet: this.nodes.unsPolygonMainnetNode });
    }
}
