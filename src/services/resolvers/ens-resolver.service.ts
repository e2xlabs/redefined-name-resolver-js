import { ResolverService } from "@resolver/services/resolvers/resolver.service";
import EvmWeb3Service from "@resolver/services/web3/evm-web3.service";
import type { Network, Account } from "@resolver/models/types";


export class EnsResolverService extends ResolverService {
    
    constructor(
        public nodeLink: string,
        public network: Network,
    ) {
        super();
    }
    
    async resolve(domain: string): Promise<Account[]> {
        try {
          return [{
              address: await EvmWeb3Service.getWeb3(this.nodeLink).eth.ens.getAddress(domain),
              network: this.network,
              from: "ens"
          }]
        } catch (e: any) {
          throw Error(`ENS Error: ${e.message}`);
        }
    }
}
