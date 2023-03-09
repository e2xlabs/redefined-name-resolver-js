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
                throw Error(`Cant resolve name ${domain}`)
            }

            const address = await resolver.getAddress(ETH_COIN_TYPE);

            if (!address) {
                throw Error(`Name is not registered ${domain}`)
            }

            return [{
                address,
                network: "evm",
                from: this.vendor,
            }];
        } catch (e: any) {
            const error = e.message;

            if (
                !throwErrorOnInvalidDomain
                && (
                    error.includes("Cant resolve name")
                    || error.includes("Name is not registered")
                    || error.includes("Illegal char")
                    || error.includes("invalid address")
                )
            ) {
                return [];
            }

            throw Error(`ENS Error: ${error}`);
        }
    }
}
