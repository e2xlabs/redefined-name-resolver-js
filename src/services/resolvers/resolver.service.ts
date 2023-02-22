import type { Nodes, Account, Network } from "@resolver/models/types";
import { flatten } from "lodash";

export abstract class ResolverService {
    
    abstract network: Network;
    
    abstract nodeLink: string;

    abstract resolve(domain: string): Promise<Account[]>;
}
