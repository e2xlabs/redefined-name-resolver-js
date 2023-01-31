import { ResolverService } from "@/services/resolvers/resolver.service";
import { Chain, SetAddressOptions } from "@/models/types";

export class RedefinedResolverService implements ResolverService {
    supportedChains = [Chain.ETH, Chain.BSC, Chain.SOL];

    async getAddresses(domain: string, chain: Chain): Promise<string[]> {
        if (!this.supportedChains.some(it => it === chain)) {
            console.log(`${chain} not supported for Unstoppable.`);
            return [];
        }

        return [];
    }

    async setAddress(domain: string, address: string, options: SetAddressOptions) {
        return true;
    }
}
