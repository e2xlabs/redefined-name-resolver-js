import { ResolverService } from "@/services/resolvers/resolver.service";
import { Network, ResolvedAddress } from "@/models/types";
import Resolution from "@unstoppabledomains/resolution";

const resolution = new Resolution();

export class UnstoppableResolverService implements ResolverService {

    supportedNetworks = [Network.ETH, Network.BSC, Network.ZIL]

    async resolve(domain: string, network: Network): Promise<ResolvedAddress[]> {
        if (!this.supportedNetworks.some(it => it === network)) {
            console.log(`${network} not supported by Unstoppable.`);
            return [];
        }

        if (!(await resolution.isRegistered(domain))) {
            console.log(`${domain} not registered with Unstoppable.`);
            return [];
        }

        try {
            return [{
                address: await resolution.addr(domain, network),
                network: network,
            }];
        } catch (e) {
            console.error("Unstoppable Error", e);
            return [];
        }
    }
}
