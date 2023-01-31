import { ResolverService } from "@/services/resolvers/resolver.service";
import { Chain } from "@/models/types";
import Resolution from "@unstoppabledomains/resolution";

const resolution = new Resolution();

export class UnstoppableResolverService implements ResolverService {
    supportedChains = [Chain.ETH, Chain.BSC, Chain.ZIL]

    async getAddresses(domain: string, chain: Chain): Promise<string[]> {
        if (!this.supportedChains.some(it => it === chain)) {
            console.log(`${chain} not supported for Unstoppable.`);
            return [];
        }

        if (!(await resolution.isRegistered(domain))) {
            console.log(`${domain} not registered at Unstoppable.`);
            return [];
        }

        try {
            return [await resolution.addr(domain, chain)];
        } catch (e) {
            console.error("Unstoppable Error", e);
            return [];
        }
    }
}
