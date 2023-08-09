import { ResolverService } from "@resolver/services/resolvers/resolver.service";
import type { Account, ReverseAccount } from "@resolver/models/types";
import Resolution from "@unstoppabledomains/resolution";
import { ResolverVendor } from "@resolver/models/types";
import EvmWeb3Service from "@resolver/services/web3/evm-web3.service";

export class UnstoppableResolverService extends ResolverService {

    get vendor(): ResolverVendor {
        return "unstoppable";
    }

    private resolution: Resolution

    constructor(
        public nodes: { mainnet: string, polygonMainnet: string },
    ) {
        super();

        this.resolution = new Resolution({
            sourceConfig: {
                uns: {
                    locations: {
                        Layer1: {
                            url: nodes.mainnet,
                            network: 'mainnet'
                        },
                        Layer2: {
                            url: nodes.polygonMainnet,
                            network: 'polygon-mainnet',
                        },
                    },
                },
            },
        });
    }

    async resolve(domain: string): Promise<Account[]> {
        try {
            if (!(await this.resolution.isRegistered(domain))) {
                throw Error(`${domain} is not registered`)
            }

            const address = await this.resolution.addr(domain, "ETH");

            return address ? [{
                address,
                network: "evm",
                from: this.vendor,
            }] : []
        } catch (e: any) {
            throw Error(`Unstoppable Error: ${e.message}`);
        }
    }

    async reverse(address: string): Promise<ReverseAccount[]> {
        try {
            if (!EvmWeb3Service.isValidAddress(address)) {
                throw Error(`Invalid address: ${address}`);
            }

            const domain = await this.resolution.reverse(address);

            return domain ? [{
                domain,
                from: this.vendor,
            }] : []
        } catch (e: any) {
            throw Error(`Unstoppable Error: ${e.message}`);
        }
    }
}
