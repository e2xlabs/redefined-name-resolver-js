import {
    ResolverService,
} from "@resolver/services/resolvers/resolver.service";
import type { Account, RedefinedReverseResponse, ReverseAccount } from "@resolver/models/types";
import { AccountRecord, ResolverVendor } from "@resolver/models/types";
import EvmWeb3Service from "@resolver/services/web3/evm-web3.service";

export abstract class RedefinedResolverService extends ResolverService {
    abstract readonly vendor: ResolverVendor

    protected constructor(
        public allowDefaultEvmResolves: boolean,
    ) {
        super();
    }

    async resolve(domain: string, networks?: string[]): Promise<Account[]> {
        const parsedDomain = domain.startsWith("@") ? domain.slice(1) : domain;

        try {
            const accounts: Account[] = (await this.resolveDomain(parsedDomain.toLowerCase())).map((it: AccountRecord) => ({
                address: it.addr,
                network: it.network,
                from: this.vendor,
            }));

            if (!accounts.length) {
                throw Error(`No records found for domain ${domain}`)
            }

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

    async reverse(address: string, networks?: string[]): Promise<ReverseAccount[]> {
        try {
            const reverseData = await this.reverseAddress(address.toLowerCase());

            if (!reverseData[1]) {
                throw Error(`No records found for address ${address}`)
            }

            const domainsRaw = JSON.parse(reverseData[1]) as string[];

            return domainsRaw.map((it) => ({
                domain: it,
                from: this.vendor,
            }));
        } catch (e: any) {
            throw Error(`redefined Error: ${e.message}`);
        }
    }

    abstract resolveDomain(domain: string): Promise<AccountRecord[]>;

    abstract reverseAddress(domain: string): Promise<RedefinedReverseResponse>;
}
