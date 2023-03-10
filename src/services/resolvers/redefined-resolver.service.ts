import {
    ResolverService,
} from "@resolver/services/resolvers/resolver.service";
import type { Account } from "@resolver/models/types";
import { AccountRecord, ResolverVendor } from "@resolver/models/types";

export abstract class RedefinedResolverService extends ResolverService {
    abstract vendor: ResolverVendor

    protected constructor(
      public allowDefaultEvmResolves: boolean,
    ) {
        super();
    }

    async resolve(domain: string, networks?: string[]): Promise<Account[]> {
        try {
            const accounts: Account[] = (await this.resolveDomain(domain.toLowerCase())).map((it: AccountRecord) => ({
                address: it.addr,
                network: it.network,
                from: this.vendor,
            }));

            const targetAccountsWithoutEvm = accounts.filter(it => (
                networks
                && networks.includes(it.network)
                && it.network !== "evm"
            ));

            if (targetAccountsWithoutEvm.length) {
                return targetAccountsWithoutEvm;
            }

            return this.allowDefaultEvmResolves
                ? accounts
                : [];
        } catch (e: any) {
            throw Error(`redefined Error: ${e.message}`);
        }
    }

    abstract resolveDomain(domain: string): Promise<AccountRecord[]>;
}
