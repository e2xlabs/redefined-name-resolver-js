import { defaultResolverServiceOptions, ResolverService, ResolverServiceOptions } from "@resolver/services/resolvers/resolver.service";
import type { Account } from "@resolver/models/types";
import { AccountRecord, ResolverVendor } from "@resolver/models/types";

export abstract class RedefinedResolverService extends ResolverService {

    vendor: ResolverVendor = "redefined"

    protected constructor(
      public allowDefaultEvmResolves: boolean,
    ) {
        super();
    }

    async resolve(domain: string, { throwErrorOnInvalidDomain }: ResolverServiceOptions = defaultResolverServiceOptions, networks?: string[]): Promise<Account[]> {
        try {
            const accounts: Account[] = (await this.resolveDomain(domain)).map((it: AccountRecord) => ({
                address: it.addr,
                network: it.network,
                from: this.vendor,
            }));

            const targetAccountsWithoutEvm = accounts.filter(it => (
                (!networks || networks.includes(it.network))
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
                || (!throwErrorOnInvalidDomain && e.message.includes("Invalid character"))
            ) {
                return [];
            }

            console.error(e);
            throw Error(`redefined Error: ${e.message}`);
        }
    }

    abstract resolveDomain(domain: string): Promise<AccountRecord[]>;
}
