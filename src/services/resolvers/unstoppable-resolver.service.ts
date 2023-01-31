import { ResolverService } from "@/services/resolvers/resolver.service";
import { Chain, SetAddressOptions } from "@/models/types";
import Resolution from "@unstoppabledomains/resolution";

const resolution = new Resolution();

class UnstoppableResolverService implements ResolverService {
    supportedChains = [Chain.ETH, Chain.BSC, Chain.ZIL]

    async getAddresses(domain: string): Promise<string[]> {
        if (!(await resolution.isRegistered(domain))) {
            console.log(`${domain} not registered at Unstoppable.`);
            return [];
        }

        if (!(await resolution.isAvailable(domain))) {
            console.log(`${domain} not available at Unstoppable.`);
            return [];
        }

        try {
            return [await resolution.resolver(domain)];
        } catch (e) {
            console.error("Unstoppable Error", e);
            return [];
        }
    }

    async setAddress(domain: string, address: string, options: SetAddressOptions): Promise<boolean> {
        return true;
    }
}

export {
    resolution,
    UnstoppableResolverService,
}
