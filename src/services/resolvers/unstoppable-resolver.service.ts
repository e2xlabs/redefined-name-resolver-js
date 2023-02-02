import { ResolverService } from "@resolver/services/resolvers/resolver.service";
import { Network, Account } from "@resolver/models/types";
import Resolution from "@unstoppabledomains/resolution";

const resolution = new Resolution();

export class UnstoppableResolverService implements ResolverService {

    supportedNetworks: Network[] = ["eth", "bsc", "zil"]

    async resolve(domain: string, network: Network): Promise<Account[]> {
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
