import { ResolverService } from "@resolver/services/resolvers/resolver.service";
import type { Account } from "@resolver/models/types";
import { ResolverVendor } from "@resolver/models/types";
import { getDomainKeySync, NameRegistryState } from "@bonfida/spl-name-service";
import SolWeb3Service from "@resolver/services/web3/sol-web3.service";
import { Connection } from "@solana/web3.js";

export class BonfidaResolverService extends ResolverService {

    private readonly connection: Connection;

    get vendor(): ResolverVendor {
        return "bonfida";
    }

    constructor(
        public cluster: string
    ) {
        super();
        this.connection = SolWeb3Service.getWeb3(this.cluster);
    }

    async resolve(domain: string): Promise<Account[]> {
        try {
            const { pubkey } = getDomainKeySync(domain);

            const { registry } = await NameRegistryState.retrieve(this.connection, pubkey);

            return [{
                address: registry.owner.toString(),
                network: "sol",
                from: this.vendor,
            }];
        } catch (e: any) {
            throw Error(`Bonfida Error: ${e.message}`);
        }
    }
}
