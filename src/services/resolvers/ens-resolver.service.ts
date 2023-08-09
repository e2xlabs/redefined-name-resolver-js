import { ResolverService } from "@resolver/services/resolvers/resolver.service";
import type { Account } from "@resolver/models/types";
import { ResolverVendor, ReverseAccount } from "@resolver/models/types";
import { ethers } from 'ethers'
import EvmWeb3Service from "@resolver/services/web3/evm-web3.service";

const ETH_COIN_TYPE = 60;

export class EnsResolverService extends ResolverService {

    private provider;

    get vendor(): ResolverVendor {
        return "ens";
    }

    constructor(
        public node: string,
    ) {
        super();
        this.provider = new ethers.providers.JsonRpcProvider(this.node);
    }

    async resolve(domain: string): Promise<Account[]> {
        try {
            const resolver = await this.provider.getResolver(domain);

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

    async reverse(address: string): Promise<ReverseAccount[]> {
        try {
            if (!EvmWeb3Service.isValidAddress(address)) {
                throw Error(`Invalid address: ${address}`);
            }

            const domain = await this.provider.lookupAddress(address);

            if (!domain) {
                throw Error(`Cant reverse ${address}`)
            }

            return [{
                domain,
                from: this.vendor,
            }];
        } catch (e: any) {
            throw Error(`ENS Error: ${e.message}`);
        }
    }
}
