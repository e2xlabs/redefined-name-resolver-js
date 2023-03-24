import type { RedefinedParams, SidParams, SidServiceParams, UnstoppableParams } from "@resolver/models/types";
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
    ResolversParams, SidChainId, SidResolverData
} from "@resolver/models/types";
import { SidResolverService } from "@resolver/services/resolvers/sid-resolver.service";

export class RedefinedResolver {

    private resolvers: ResolverService[];

    constructor(
      private options?: ResolverOptions
    ) {
        if (options && !options.resolvers.length) {
            throw Error("“resolvers” option must be a non-empty array or falsy")
        }

        this.resolvers = options?.resolvers || RedefinedResolver.createDefaultResolvers();
    }

    async resolve(domain: string, networks?: string[], options?: CustomResolverServiceOptions): Promise<ResolverResponse> {
        const data: ResolverResponse = {
            response: [],
            errors: [],
        }
        
        await Promise.all(
            this.resolvers.map(async resolver => {
                try {
                    const accounts = await resolver.resolve(domain, networks, options);
                    data.response.push(...accounts.filter(it => !networks || networks.includes(it.network) || it.network === "evm"))
                } catch (e: any) {
                    data.errors.push({ vendor: resolver.vendor, error: e.message })
                }
            })
        );

        return data
    }

    static createDefaultResolvers(options?: ResolversParams) {
        return [
            ...this.createRedefinedResolvers(options?.redefined),
            this.createEnsResolver(options?.ens),
            this.createUnstoppableResolver(options?.unstoppable),
            ...this.createSidResolvers(options?.sid),
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
    
    static createSidResolvers(options?: SidParams) {
        return [
            this.createSidBscResolver(options?.bsc),
            this.createSidArbOneResolver(options?.arb),
            this.createSidArbNovaResolver(options?.arb),
        ]
    }
    
    static createSidBscResolver(options?: SidServiceParams) {
        return new SidResolverService(options?.node || config.SID_BSC_NODE, SidChainId.BSC, "bsc");
    }
    
    static createSidArbOneResolver(options?: SidServiceParams) {
        return new SidResolverService(options?.node || config.SID_ARB_ONE_NODE, SidChainId.ARB, "arbitrum-one", SidResolverData.ARB1);
    }
    
    static createSidArbNovaResolver(options?: SidServiceParams) {
        return new SidResolverService(options?.node || config.SID_ARB_ONE_NODE, SidChainId.ARB, "arbitrum-nova", SidResolverData.ARB_NOVA);
    }
}
