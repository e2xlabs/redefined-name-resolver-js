import { ResolverService } from "./resolver.service";
import type { Network, Account } from "../../models/types";
export declare class UnstoppableResolverService extends ResolverService {
    supportedNetworks: Network[];
    resolve(domain: string, network: Network, nodeLink: string): Promise<Account[]>;
}
