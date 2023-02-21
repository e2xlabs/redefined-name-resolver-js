import { ResolverService } from "@resolver/services/resolvers/resolver.service";
import EvmWeb3Service from "@resolver/services/web3/evm-web3.service";
import type { Network, Account } from "@resolver/models/types";


export class EnsResolverService extends ResolverService {

    async resolve(domain: string, network: Network, nodeLink: string): Promise<Account[]> {
        try {
          return [{
              address: await EvmWeb3Service.getWeb3(nodeLink).eth.ens.getAddress(domain),
              network: network,
              from: "ens"
          }]
        } catch (e: any) {
          throw Error(`ENS Error: ${e.message}`);
        }
    }
}
