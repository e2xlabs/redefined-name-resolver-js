import { ResolverService } from "@/services/resolvers/resolver.service";
import EvmWeb3Service from "@/services/web3/evm-web3.service";
import { Network, ResolvedAddress } from "@/models/types";


export class EnsResolverService implements ResolverService {

    supportedNetworks = [Network.ETH, Network.BSC]

    async resolve(domain: string, network: Network): Promise<ResolvedAddress[]> {
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
