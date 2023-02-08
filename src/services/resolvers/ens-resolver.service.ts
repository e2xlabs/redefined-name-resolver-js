import { ResolverService } from "@resolver/services/resolvers/resolver.service";
import EvmWeb3Service from "@resolver/services/web3/evm-web3.service";
import type { Network, Account } from "@resolver/models/types";


export class EnsResolverService extends ResolverService {

    getSupportedNetworks(): Network[] {
      return ["eth", "bsc"];
    }

    async resolve(domain: string, network: Network, nodeLink: string): Promise<Account[]> {
        if (!this.getSupportedNetworks().some(it => it === network)) {
          console.log(`${network} not supported by Ens.`);
          return [];
        }

        try {
          return [{
              address: await EvmWeb3Service.getWeb3(nodeLink).eth.ens.getAddress(domain),
              network: network,
              from: "ens"
          }]
        } catch (e: any) {
          console.error("ENS Error", e.message);
          return []
        }
    }
}
