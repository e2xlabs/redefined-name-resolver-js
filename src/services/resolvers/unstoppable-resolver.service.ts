import { ResolverService } from "@resolver/services/resolvers/resolver.service";
import type { Network, Account } from "@resolver/models/types";
import Resolution from "@unstoppabledomains/resolution";
import { ResolverServices } from "@resolver/models/types";

export class UnstoppableResolverService extends ResolverService {

    vendor: ResolverServices = "unstoppable"

    private resolution = new Resolution();

    constructor(
        public nodeLink: string,
        public network: Network,
    ) {
        super();
    }

    async resolve(domain: string): Promise<Account[]> {
        try {
            if (!(await this.resolution.isRegistered(domain))) {
                return [];
            }

            return [{
                address: await this.resolution.addr(domain, this.network),
                network: this.network,
                from: "unstoppable"
            }];
        } catch (e: any) {
            throw Error(`Unstoppable Error: ${e.message}`);
        }
    }
}
