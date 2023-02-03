import { ResolverService } from "@/services/resolvers/resolver.service";
import EvmWeb3Service from "@/services/web3/evm-web3.service";
import { Network, Account } from "@/models/types";


export class EnsResolverService implements ResolverService {

    supportedNetworks: Network[] = ["eth", "bsc"]

    async resolve(domain: string, network: Network): Promise<Account[]> {
        if (!this.supportedNetworks.some(it => it === network)) {
          console.log(`${network} not supported by Ens.`);
          return [];
        }

        try {
          return [{
              address: await EvmWeb3Service.getWeb3(network).eth.ens.getAddress(domain),
              network: network,
          }]
        } catch (e) {
          console.error("ENS Error", e);
          return []
        }
    }
}
