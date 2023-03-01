import { ResolverService } from "@resolver/services/resolvers/resolver.service";
import type { Account } from "@resolver/models/types";
import { ResolverServices } from "@resolver/models/types";
import { ethers } from 'ethers'
import { formatsByName } from "@ensdomains/address-encoder";
// @ts-ignore
import ENS, { getEnsAddress } from '@ensdomains/ensjs'

const COIN_LIST = Object.fromEntries(Object.entries(formatsByName).filter(([key, value]) => !key.match(/_LEGACY/)));

export class EnsResolverService extends ResolverService {

    vendor: ResolverServices = "ens"

    constructor(
        public node: string,
    ) {
        super();
    }

    async resolve(domain: string, throwErrorOnIllegalCharacters: boolean = true, networks?: string[]): Promise<Account[]> {
        const provider = new ethers.providers.JsonRpcProvider(this.node);
    
        try {
            const resolver = await provider.getResolver(domain)
    
            return !networks || networks.includes("eth")
                ? [{
                    address: await resolver!.getAddress(COIN_LIST.ETH.coinType),
                    network: "eth",
                    from: "ens"
                }]
                : []
        } catch (e: any) {
            throw Error(e.message);
        }
    }
}
