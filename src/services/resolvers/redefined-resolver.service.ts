import { ResolverService } from "@/services/resolvers/resolver.service";
import EvmWeb3Service from "@/services/web3/evm-web3.service";
import { Chain, SetAddressOptions } from "@/models/types";

const web3 = EvmWeb3Service.getWeb3(Chain.ETH);

export class RedefinedResolverService implements ResolverService {
    async getAddresses(alias: string): Promise<string[]> {
        console.log(`Get redefined address for ${alias}`);
        return [];
    }

    async setAddress(alias: string, address: string, options: SetAddressOptions) {
        return true;
    }
}
