import { Network, Account } from "@resolver/models/types";

export interface ResolverService {
    resolve(domain: string, network: Network, nodeLink: string): Promise<Account[]>;
}
