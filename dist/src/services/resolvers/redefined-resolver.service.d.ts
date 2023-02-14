import { ResolverService } from "./resolver.service";
import type { Account, Network } from "../../models/types";
export declare class RedefinedResolverService extends ResolverService {
    supportedNetworks: Network[];
    resolve(domain: string, network: Network, nodeLink: string): Promise<Account[]>;
}
