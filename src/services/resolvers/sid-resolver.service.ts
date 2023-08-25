import { ResolverService, SupportReverse } from "@resolver/services/resolvers/resolver.service";
import type { Account, ReverseAccount } from "@resolver/models/types";
import { ResolverVendor, SidChainId, SidResolverData } from "@resolver/models/types";
import EvmWeb3Service from "@resolver/services/web3/evm-web3.service";
// @ts-ignore sidjs does not support typescript
import SID, { getSidAddress } from '@siddomains/sidjs'

export class SidResolverService extends ResolverService implements SupportReverse {
    
    sid: any;
    
    constructor(
        public node: string,
        public chainId: SidChainId,
        public network: string,
        public resolverData?: SidResolverData
    ) {
        super();
        this.sid = new SID({ provider: EvmWeb3Service.getWeb3Http(node), sidAddress: getSidAddress(chainId) })
    }
    
    get vendor(): ResolverVendor {
        return "sid";
    }
    
    async resolve(domain: string): Promise<Account[]> {
        try {
            const address = await this.sid.name(domain).getAddress(this.resolverData);
            
            if (address === "0x0000000000000000000000000000000000000000") {
                throw Error(`Domain ${domain} is not registered`)
            }
            
            return [{
                address,
                network: this.network,
                from: this.vendor
            }]
        } catch (e: any) {
            throw Error(`SID Error: ${e.message}`);
        }
    }

    async reverse(address: string): Promise<ReverseAccount[]> {
        try {
            if (!EvmWeb3Service.isValidAddress(address)) {
                throw Error(`Invalid address: ${address}`);
            }

            const domain = await this.sid.getName(address);

            if(!domain.name) return [];

            return [{
                domain: domain.name,
                from: this.vendor
            }]
        } catch (e: any) {
            throw Error(`SID Error: ${e.message}`);
        }
    }
}
