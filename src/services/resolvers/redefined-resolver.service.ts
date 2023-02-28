
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

    async resolve(domain: string, networks?: RequestedNetwork[]): Promise<Account[]> {
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
    }

    abstract resolveDomain(domain: string): Promise<AccountRecord[]>;
}
