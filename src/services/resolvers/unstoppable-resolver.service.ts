import { defaultResolverServiceOptions, ResolverService, ResolverServiceOptions } from "@resolver/services/resolvers/resolver.service";
import type { Account } from "@resolver/models/types";
import Resolution  from "@unstoppabledomains/resolution";
import { ResolverName } from "@resolver/models/types";

export class UnstoppableResolverService extends ResolverService {

    vendor: ResolverName = "unstoppable"

    private resolution: Resolution

    constructor(
        public nodes: { eth: string, polygon: string },
    ) {
        super();

        this.resolution = new Resolution({
            sourceConfig: {
                uns: {
                    locations: {
                        Layer1: {
                            url: nodes.eth,
                            network: 'mainnet'
                        },
                        Layer2: {
                            url: nodes.polygon,
                            network: 'polygon-mainnet',
                        },
                    },
                },
            },
        });
    }

    async resolve(domain: string, { throwErrorOnInvalidDomain }: ResolverServiceOptions = defaultResolverServiceOptions): Promise<Account[]> {
        try {
            if (!(await this.resolution.isRegistered(domain))) {
                return [];
            }

            return [{
                address: await this.resolution.addr(domain, "ETH"),
                network: "eth",
                from: this.vendor,
            }]
        } catch (e: any) {

            if (!throwErrorOnInvalidDomain && e.message.includes("is invalid")) {
                return [];
            }

            console.error(e);
            throw Error(`Unstoppable Error: ${e.message}`);
        }
    }
}
