import { ResolverService } from "@resolver/services/resolvers/resolver.service";
import type { Account, Network } from "@resolver/models/types";
export declare class RedefinedResolverService extends ResolverService {
    supportedNetworks: Network[];
    resolve(domain: string, network: Network, nodeLink: string): Promise<Account[]>;
}
//# sourceMappingURL=redefined-resolver.service.d.ts.map