import type { ResolverService } from "@resolver/services/resolvers/resolver.service";
import type { Network, Account } from "@resolver/models/types";
import Resolution from "@unstoppabledomains/resolution";

const resolution = new Resolution();

export class UnstoppableResolverService implements ResolverService {

    supportedNetworks: Network[] = ["eth", "bsc", "zil"]

    async resolve(domain: string, network: Network): Promise<Account[]> {
        if (!this.supportedNetworks.some(it => it === network)) {
            console.log(`${network} not supported by Unstoppable.`);
            return [];
        }

        try {
            if (!(await resolution.isRegistered(domain))) {
                console.log(`${domain} not registered with Unstoppable.`);
                return [];
            }

            return [{
                address: await resolution.addr(domain, network),
                network: network,
            }];
        } catch (e: any) {
            console.error("Unstoppable Error", e.message);
            return [];
        }
    }
}
