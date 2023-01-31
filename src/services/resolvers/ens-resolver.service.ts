import { ResolverService } from "@/services/resolvers/resolver.service";
import EvmWeb3Service from "@/services/web3/evm-web3.service";
import { Chain } from "@/models/types";

const web3 = EvmWeb3Service.getWeb3(Chain.ETH);

export class EnsResolverService implements ResolverService {
    async getAddresses(domain: string): Promise<string[]> {
        try {
          return [await web3.eth.ens.getAddress(domain)]
        } catch (e) {
          console.error("ENS Error", e);
          return []
        }
    }
}
