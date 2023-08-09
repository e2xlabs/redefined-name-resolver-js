import type {
    BonfidaParams,
    LensParams,
    RedefinedParams,
    ResolverReverseResponse,
    SidParams,
    UnstoppableParams
} from "@resolver/models/types";
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
import { BonfidaResolverService } from "@resolver/services/resolvers/bonfida-resolver.service";
import { LensResolverService } from "./services/resolvers/lens-resolver.service";
import { BulkProxy } from "@resolver/services/proxies/bulk-resolver.service";
import { remove } from "lodash";

export class RedefinedResolver {

    private resolvers: ResolverService[];

    private config: Promise<ResolversParams> | undefined = undefined;

    constructor(
      private options?: ResolverOptions,
      private resolversParams?: ResolversParams,
    ) {
        if (options && !options.resolvers.length) {
            throw Error("“resolvers” option must be a non-empty array or falsy")
        }

        if (this.resolversParams) {
            this.config = Promise.resolve(this.resolversParams);
        }

        if (!options && !this.resolversParams) {
            this.config = new Promise(async (resolve) => {
                try {
                    resolve(await (await fetch(`${config.CONFIGS_URL}?v=${new Date().valueOf()}`)).json());
                } catch (e) {
                    console.log(e);
                }
            });
        }

        this.resolvers = options?.resolvers || [];
    }

    async resolve(domain: string, networks?: string[], options?: CustomResolverServiceOptions, vendors?: string[]): Promise<ResolverResponse> {
        if (!this.resolvers.length) {
            this.resolvers = RedefinedResolver.createDefaultResolvers(await this.config);
        }

        const data: ResolverResponse = {
            response: [],
            errors: [],
        }
        
        await Promise.all(
            this.resolvers.filter(it => !vendors || vendors.includes(it.vendor))
                .map(async resolver => {
                    try {
                        const accounts = await resolver.resolve(domain, networks, options);

                        if(resolver.vendor == "redefined-username" || resolver.vendor == "redefined-email") {
                            const bonfida = this.resolvers.find(it => it.vendor == "bonfida");

                            if(bonfida) {

                                const toMap = remove(accounts, it => it.network == "sol" && it.address.endsWith(".sol"))

                                accounts.push(
                                    ...(await Promise.all(
                                        toMap.map(it => bonfida.resolve(it.address, networks, options))
                                    )).flat()
                                )
                            }
                        }

                        data.response.push(...accounts.filter(it => !networks || networks.includes(it.network) || it.network === "evm"))
                    } catch (e: any) {
                        data.errors.push({ vendor: resolver.vendor, error: e.message })
                    }
                })
        );

        return data
    }

    async reverse(address: string, vendors?: string[]): Promise<ResolverReverseResponse> {
        if (!this.resolvers.length) {
            this.resolvers = RedefinedResolver.createDefaultResolvers(await this.config);
        }

        const data: ResolverReverseResponse = {
            response: [],
            errors: [],
        }

        await Promise.all(
            this.resolvers.filter(it => !vendors || vendors.includes(it.vendor))
                .map(async resolver => {
                    try {
                        data.response.push(...await resolver.reverse(address));
                    } catch (e: any) {
                        data.errors.push({ vendor: resolver.vendor, error: e.message })
                    }
                })
        );

        return data
    }

    static createDefaultResolvers(options?: ResolversParams) {
        return [
            new BulkProxy<RedefinedParams, RedefinedEmailResolverService>(options?.redefined, this.createRedefinedEmailResolver),
            new BulkProxy<RedefinedParams, RedefinedUsernameResolverService>(options?.redefined, this.createRedefinedUsernameResolver),
            new BulkProxy<EnsParams, EnsResolverService>(options?.ens, this.createEnsResolver),
            new BulkProxy<UnstoppableParams, UnstoppableResolverService>(options?.unstoppable, this.createUnstoppableResolver),
            new BulkProxy<SidParams, SidResolverService>(options?.sid, this.createSidArbOneResolver),
            new BulkProxy<SidParams, SidResolverService>(options?.sid, this.createSidArbNovaResolver),
            new BulkProxy<SidParams, SidResolverService>(options?.sid, this.createSidBscResolver),
            new BulkProxy<BonfidaParams, BonfidaResolverService>(options?.bonfida, this.createBonfidaResolver),
            new BulkProxy<LensParams, LensResolverService>(options?.lens, this.createLensResolver),
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

    static createSidBscResolver(options?: SidParams) {
        return new SidResolverService(options?.bscNode || config.SID_BSC_NODE, SidChainId.BSC, "bsc");
    }
    
    static createSidArbOneResolver(options?: SidParams) {
        return new SidResolverService(options?.arbitrumOneNode || config.SID_ARB_ONE_NODE, SidChainId.ARB, "arbitrum-one", SidResolverData.ARB1);
    }
    
    static createSidArbNovaResolver(options?: SidParams) {
        return new SidResolverService(options?.arbitrumOneNode || config.SID_ARB_ONE_NODE, SidChainId.ARB, "arbitrum-nova", SidResolverData.ARB_NOVA);
    }

    static createBonfidaResolver(options?: BonfidaParams) {
        return new BonfidaResolverService(options?.cluster || config.SOLANA_NODE);
    }

    static createLensResolver(options?: LensParams) {
        return new LensResolverService(options?.apiUrl || config.LENS_API_URL);
    }
}
