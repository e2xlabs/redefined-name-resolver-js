import type { RedefinedParams, Resolver, UnstoppableParams } from "@resolver/models/types";
import type { ResolverOptions } from "@resolver/models/types";
import type { ResolverService } from "@resolver/services/resolvers/resolver.service";
import { RedefinedUsernameResolverService } from "@resolver/services/resolvers/redefined-username-resolver.service";
import { RedefinedEmailResolverService } from "@resolver/services/resolvers/redefined-email-resolver.service";
import { EnsResolverService } from "@resolver/services/resolvers/ens-resolver.service";
import { UnstoppableResolverService } from "@resolver/services/resolvers/unstoppable-resolver.service";
import config from "@resolver/config";
import {
    CustomResolverServiceOptions,
    EnsParams,
    ResolverResponse,
    ResolversParams
} from "@resolver/models/types";

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

    async resolve(domain: string, networks?: string[], options?: CustomResolverServiceOptions): Promise<ResolverResponse> {
        const result = await Promise.allSettled(
            this.resolvers.map(async resolver => {
                try {
                    // @ts-ignore
                    return await resolver.resolve(domain, { throwErrorOnInvalidDomain: false, ...(options || {}), }, networks)
                } catch (e: any) {
                    throw Error(JSON.stringify({ vendor: resolver.vendor, error: e.message }))
                }
            })
        );

        const data: ResolverResponse = {
            response: [],
            errors: [],
        }

        result.forEach(it => {
            if (it.status === "fulfilled") {
                data.response.push(...it.value.filter(it => !networks || networks.includes(it.network) || it.network === "evm"))
            } else if (it.status === "rejected") {
                data.errors.push(JSON.parse(it.reason.message))
            }
        })

        return data
    }

    static createDefaultResolvers(options?: ResolversParams) {
        return [
            ...this.createRedefinedResolvers(options?.redefined),
            this.createEnsResolver(options?.ens),
            this.createUnstoppableResolver(options?.unstoppable),
        ]
    }

    static createRedefinedResolvers(options?: RedefinedParams) {
        return [
            this.createRedefinedUsernameResolver(options),
            this.createRedefinedEmailResolver(options),
        ]
    }

    static createRedefinedEmailResolver(options?: RedefinedParams) {
        return new RedefinedEmailResolverService(
            options?.node || config.REDEFINED_NODE,
            options?.allowDefaultEvmResolves !== undefined
                ? options.allowDefaultEvmResolves
                : true,
        );
    }

    static createRedefinedUsernameResolver(options?: RedefinedParams) {
        return new RedefinedUsernameResolverService(
            options?.node || config.REDEFINED_NODE,
            options?.allowDefaultEvmResolves !== undefined
                ? options.allowDefaultEvmResolves
                : true,
        );
    }

    static createEnsResolver(options?: EnsParams) {
        return new EnsResolverService(options?.node || config.ENS_NODE);
    }

    static createUnstoppableResolver(options?: UnstoppableParams) {
        return new UnstoppableResolverService({
            mainnet: options?.mainnetNode || config.UNS_MAINNET_NODE,
            polygonMainnet: options?.polygonMainnetNode || config.UNS_POLYGON_MAINNET_NODE,
        });
    }
}
