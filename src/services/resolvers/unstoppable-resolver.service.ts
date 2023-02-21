import { ResolverService } from "@resolver/services/resolvers/resolver.service";
import type { Network, Account } from "@resolver/models/types";
import Resolution from "@unstoppabledomains/resolution";

const resolution = new Resolution();

export class UnstoppableResolverService extends ResolverService {

    async resolve(domain: string, network: Network, nodeLink: string): Promise<Account[]> {
        try {
            if (!(await resolution.isRegistered(domain))) {
                return [];
            }

            return [{
                address: await resolution.addr(domain, network),
                network: network,
                from: "unstoppable"
            }];
        } catch (e: any) {
            throw Error(`Unstoppable Error: ${e.message}`);
        }
    }
}
