import { defaultResolverServiceOptions, ResolverService, ResolverServiceOptions } from "@resolver/services/resolvers/resolver.service";
import type { Account } from "@resolver/models/types";
import { ResolverVendor } from "@resolver/models/types";
import { ethers } from 'ethers'

const ETH_COIN_TYPE = 60;

export class EnsResolverService extends ResolverService {

    vendor: ResolverVendor = "ens"

    constructor(
        public node: string,
    ) {
        super();
    }

    async resolve(domain: string, { throwErrorOnInvalidDomain }: ResolverServiceOptions = defaultResolverServiceOptions): Promise<Account[]> {
        const provider = new ethers.providers.JsonRpcProvider(this.node);

        try {
            const resolver = await provider.getResolver(domain);
            
            if (!resolver) {
                return [];
            }

            const address = await resolver.getAddress(ETH_COIN_TYPE);
            
            return address ? [{
                address,
                network: "evm",
                from: this.vendor,
            }] : [];
        } catch (e: any) {
            if (!throwErrorOnInvalidDomain && e.message.includes("Illegal char")) {
                return [];
            }

            console.error(e);
            throw Error(`ENS Error: ${e.message}`);
        }
    }
}
