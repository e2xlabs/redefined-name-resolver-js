import { ResolverService } from "@resolver/services/resolvers/resolver.service";
import type { Account, ReverseAccount } from "@resolver/models/types";
import { ResolverVendor } from "@resolver/models/types";
import {
    getAllDomains,
    getDomainKeySync,
    NameRegistryState,
    reverseLookup
} from "@bonfida/spl-name-service";
import SolWeb3Service from "@resolver/services/web3/sol-web3.service";
import { Connection, PublicKey } from "@solana/web3.js";

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
            if (!domain.endsWith(".sol")) {
                throw Error(`${domain} is not supported`);
            }

            const { pubkey } = getDomainKeySync(domain);

            const { registry, nftOwner } = await NameRegistryState.retrieve(this.connection, pubkey);

            return [{
                address: nftOwner?.toString() || registry.owner.toString(),
                network: "sol",
                from: this.vendor,
            }];
        } catch (e: any) {
            throw Error(`Bonfida Error: ${e.message}`);
        }
    }

    async reverse(address: string): Promise<ReverseAccount[]> {
        try {
            if (!SolWeb3Service.isValidAddress(address)) {
                throw Error(`Invalid address: ${address}`);
            }

            const ownerKey = new PublicKey(address);
            const domainKeys = await getAllDomains(this.connection, ownerKey);
            const domains = await Promise.all(domainKeys.map(it => reverseLookup(this.connection, it)));

            return domains.map(domain => ({
                domain, // add .sol?
                network: "sol",
                from: this.vendor,
            }))
        } catch (e: any) {
            throw Error(`Bonfida Error: ${e.message}`);
        }
    }
}
