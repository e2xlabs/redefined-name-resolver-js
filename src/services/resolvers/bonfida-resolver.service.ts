import { ResolverService } from "@resolver/services/resolvers/resolver.service";
import type { Account } from "@resolver/models/types";
import { ResolverVendor } from "@resolver/models/types";
import { getDomainKeySync, NameRegistryState } from "@bonfida/spl-name-service";
import SolWeb3Service from "@resolver/services/web3/sol-web3.service";
import { Cluster } from "@solana/web3.js";

export class BonfidaResolverService extends ResolverService {

    get vendor(): ResolverVendor {
        return "bonfida";
    }

    constructor(
        public cluster: Cluster = "mainnet-beta",
    ) {
        super();
    }

    async resolve(domain: string): Promise<Account[]> {
        try {
            const {pubkey} = getDomainKeySync(domain);
            const connection = SolWeb3Service.getWeb3(this.cluster);

            const {registry} = await NameRegistryState.retrieve(connection, pubkey);

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
