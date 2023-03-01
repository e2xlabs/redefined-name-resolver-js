import { ResolverService } from "@resolver/services/resolvers/resolver.service";
import EvmWeb3Service from "@resolver/services/web3/evm-web3.service";
import type { Network, Account } from "@resolver/models/types";
import { ResolverServices } from "@resolver/models/types";


export class EnsResolverService extends ResolverService {

    vendor: ResolverServices = "ens"

    constructor(
        public nodeLink: string,
        public network: Network,
    ) {
        super();
    }

    async resolve(domain: string, throwErrorOnIllegalCharacters: boolean = true): Promise<Account[]> {
        const ens = EvmWeb3Service.getWeb3(this.nodeLink).eth.ens;
        
        try {
            return [{
              address: await ens.getAddress(domain),
              network: this.network,
              from: "ens"
            }]
        } catch (e: any) {
            if (!throwErrorOnIllegalCharacters && e.message.includes("Illegal char")) {
                return [];
            }
            
            console.error(e);
            throw Error(`ENS Error: ${e.message}`);
        }
    }
}
