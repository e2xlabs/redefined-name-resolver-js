import { ResolverService } from "@resolver/services/resolvers/resolver.service";
import type { Network, Account } from "@resolver/models/types";
export declare class UnstoppableResolverService extends ResolverService {
    supportedNetworks: Network[];
    resolve(domain: string, network: Network, nodeLink: string): Promise<Account[]>;
}
//# sourceMappingURL=unstoppable-resolver.service.d.ts.map