
import { ResolverService } from "@resolver/services/resolvers/resolver.service";
import type { Account, Network } from "@resolver/models/types";
import { AccountRecord, RequestedNetwork, ResolverServices } from "@resolver/models/types";

export abstract class RedefinedResolverService extends ResolverService {

    vendor: ResolverServices = "redefined"

    allNetworksSupported = true;

    abstract network: Network;

    abstract nodeLink: string;

    protected constructor(
      public allowDefaultEvmResolves: boolean,
    ) {
        super();
    }

    async resolve(domain: string, throwErrorOnIllegalCharacters: boolean = true, networks?: RequestedNetwork[]): Promise<Account[]> {
        try {
            const accounts: Account[] = (await this.resolveDomain(domain)).map((it: AccountRecord) => ({
                address: it.addr,
                network: it.network,
                from: "redefined"
            }));
    
            const targetAccountsWithoutEvm = accounts.filter(it => (
                (!networks || networks.includes(it.network as RequestedNetwork))
                && it.network !== "evm"
            ));
    
            if (targetAccountsWithoutEvm.length) {
                return targetAccountsWithoutEvm;
            }
    
            return this.allowDefaultEvmResolves
                ? accounts.filter(it => it.network === "evm")
                : [];
        } catch (e: any) {
    
            if (
                e.message.includes("Name is not registered")
                || (!throwErrorOnIllegalCharacters && e.message.includes("Invalid character"))
            ) {
                return [];
            }
    
            console.error(e);
            throw Error(`redefined Error: ${e.message}`);
        }
    }

    abstract resolveDomain(domain: string): Promise<AccountRecord[]>;
}
