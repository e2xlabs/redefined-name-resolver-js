import { ResolverService } from "@/services/resolvers/resolver.service";
import EvmWeb3Service from "@/services/web3/evm-web3.service";
import { Chain } from "@/models/types";


export class EnsResolverService implements ResolverService {

    supportedChains = [Chain.ETH, Chain.BSC]

    async resolve(domain: string, chain: Chain): Promise<string[]> {
        if (!this.supportedChains.some(it => it === chain)) {
          console.log(`${chain} not supported by Ens.`);
          return [];
        }

        try {
          return [await EvmWeb3Service.getWeb3(chain).eth.ens.getAddress(domain)]
        } catch (e) {
          console.error("ENS Error", e);
          return []
        }
    }
}
