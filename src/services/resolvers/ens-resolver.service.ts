import type { ResolverService } from "@resolver/services/resolvers/resolver.service";
import EvmWeb3Service from "@resolver/services/web3/evm-web3.service";
import type { Network, Account } from "@resolver/models/types";


export class EnsResolverService implements ResolverService {

    supportedNetworks: Network[] = ["eth", "bsc"];

    async resolve(domain: string, network?: Network, nodeLink?: string): Promise<Account[]> {
        if (!network || !this.supportedNetworks.some(it => it === network)) {
            console.log(`${network || "Unknown"} not supported by Ens.`);
            return [];
        }
        
        if (!nodeLink) {
            console.log("No node link provided for Ens.");
            return [];
        }

        try {
          return [{
              address: await EvmWeb3Service.getWeb3(nodeLink).eth.ens.getAddress(domain),
              network: network,
          }]
        } catch (e: any) {
          console.error("ENS Error", e.message);
          return []
        }
    }
}
