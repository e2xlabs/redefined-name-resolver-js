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

    async resolve(domain: string): Promise<Account[]> {
        const ens = EvmWeb3Service.getWeb3(this.nodeLink).eth.ens;

        // domain validation request
        // if it fell, then it is not valid
        try {
          await ens.recordExists(domain)
        } catch (e) {
          console.error(e);
          return [];
        }

        try {
          return [{
              address: await ens.getAddress(domain),
              network: this.network,
              from: "ens"
          }]
        } catch (e: any) {
          throw Error(`ENS Error: ${e.message}`);
        }
    }
}
