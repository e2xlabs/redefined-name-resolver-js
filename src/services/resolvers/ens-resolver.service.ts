import { ResolverService } from "@resolver/services/resolvers/resolver.service";
import type { Account } from "@resolver/models/types";
import { ResolverVendor } from "@resolver/models/types";
import { ethers } from 'ethers'

const ETH_COIN_TYPE = 60;

export class EnsResolverService extends ResolverService {

    get vendor(): ResolverVendor {
        return "ens";
    }

    constructor(
        public node: string,
    ) {
        super();
    }

    async resolve(domain: string): Promise<Account[]> {
        const provider = new ethers.providers.JsonRpcProvider(this.node);

        try {
            const resolver = await provider.getResolver(domain);

            if (!resolver) {
                throw Error(`Cant resolve ${domain}`)
            }

            const address = await resolver.getAddress(ETH_COIN_TYPE);

            if (!address) {
                throw Error(`${domain} is not registered`)
            }

            return [{
                address,
                network: "evm",
                from: this.vendor,
            }];
        } catch (e: any) {
            throw Error(`ENS Error: ${e.message}`);
        }
    }
}
