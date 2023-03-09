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

            const error = e.message;

            if (
                !throwErrorOnInvalidDomain
                && (
                    error.includes("Name is not registered")
                    || error.includes("Invalid character")
                    || error.includes("Name should be at")
                    || error.includes("Name has incorrect length")
                )
            ) {
                return [];
            }

            throw Error(`redefined Error: ${error}`);
        }
    }

    abstract resolveDomain(domain: string): Promise<AccountRecord[]>;
}
