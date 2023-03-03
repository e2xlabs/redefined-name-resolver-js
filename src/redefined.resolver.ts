import type { Account, Resolver } from "@resolver/models/types";
import type { ResolverOptions } from "@resolver/models/types";
import type { ResolverService } from "@resolver/services/resolvers/resolver.service";
import { RedefinedUsernameResolverService } from "@resolver/services/resolvers/redefined-username-resolver.service";
import { RedefinedEmailResolverService } from "@resolver/services/resolvers/redefined-email-resolver.service";
import { EnsResolverService } from "@resolver/services/resolvers/ens-resolver.service";
import { UnstoppableResolverService } from "@resolver/services/resolvers/unstoppable-resolver.service";
import { flatten } from "lodash";
import config from "@resolver/config";
import { CreateResolverOptions, CustomResolverServiceOptions } from "@resolver/models/types";

export class RedefinedResolver implements Resolver {

    private resolvers: ResolverService[];

    constructor(
      public options?: ResolverOptions
    ) {
        if (options && !options.resolvers.length) {
            throw Error("“resolvers” option must be a non-empty array or falsy")
        }
        
        this.resolvers = options?.resolvers || RedefinedResolver.createDefaultResolvers();
    }

    async resolve(domain: string, networks?: string[], options?: CustomResolverServiceOptions): Promise<Account[]> {
        const customOptions = options || {};
        // throwErrorOnInvalidDomain - non-rewritable parameter
        // If it is true, then everything will fall on an error in one resolver
        return flatten(
          await Promise.all(this.resolvers.map(it => it.resolve(domain, { ...customOptions, throwErrorOnInvalidDomain: false }, networks)))
        ).filter(it => !networks || networks.includes(it.network) || it.network === "evm")
    }

    static createDefaultResolvers(options?: CreateResolverOptions) {
        return [
            ...this.createRedefinedResolvers(options),
            this.createEnsResolver(options),
            this.createUnstoppableResolver(options),
        ]
    }
    
    static createRedefinedResolvers(options?: CreateResolverOptions) {
        return [
            this.createRedefinedUsernameResolver(options),
            this.createRedefinedEmailResolver(options),
        ]
    }
    
    static createRedefinedEmailResolver(options?: CreateResolverOptions) {
        return new RedefinedEmailResolverService(
            options?.nodes?.redefinedNode || config.REDEFINED_NODE,
            options?.allowDefaultEvmResolves !== undefined
                ? options.allowDefaultEvmResolves
                : true
        );
    }
    
    static createRedefinedUsernameResolver(options?: CreateResolverOptions) {
        return new RedefinedUsernameResolverService(
            options?.nodes?.ensNode || config.REDEFINED_NODE,
            options?.allowDefaultEvmResolves !== undefined
                ? options.allowDefaultEvmResolves
                : true
        );
    }
    
    static createEnsResolver(options?: CreateResolverOptions) {
        return new EnsResolverService(options?.nodes?.ensNode || config.ENS_NODE);
    }
    
    static createUnstoppableResolver(options?: CreateResolverOptions) {
        return new UnstoppableResolverService({
            mainnet: options?.nodes?.unsMainnetNode || config.UNS_MAINNET_NODE,
            polygonMainnet: options?.nodes?.unsPolygonMainnetNode || config.UNS_POLYGON_MAINNET_NODE,
        });
    }
}
