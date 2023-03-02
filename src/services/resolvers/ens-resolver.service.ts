import { defaultResolverServiceOptions, ResolverService, ResolverServiceOptions } from "@resolver/services/resolvers/resolver.service";
import type { Account } from "@resolver/models/types";
import { ResolverServices } from "@resolver/models/types";
import { ethers } from 'ethers'
import { formatsByName } from "@ensdomains/address-encoder";

const COIN_LIST = Object.fromEntries(Object.entries(formatsByName).filter(([key, value]) => !key.match(/_LEGACY/)));

export class EnsResolverService extends ResolverService {

    vendor: ResolverServices = "ens"

    constructor(
        public node: string,
    ) {
        super();
    }

    async resolve(domain: string, { throwErrorOnInvalidDomain }: ResolverServiceOptions = defaultResolverServiceOptions): Promise<Account[]> {
        const provider = new ethers.providers.JsonRpcProvider(this.node);

        try {
            const resolver = await provider.getResolver(domain)

            return [{
                address: await resolver!.getAddress(COIN_LIST.ETH.coinType),
                network: "eth",
                from: "ens"
            }]
        } catch (e: any) {
            if (!throwErrorOnInvalidDomain && e.message.includes("Illegal char")) {
                return [];
            }

            console.error(e);
            throw Error(`ENS Error: ${e.message}`);
        }
    }
}
