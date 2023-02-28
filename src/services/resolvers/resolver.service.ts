import type { Nodes, Account, Network, RequestedNetwork, ResolverServices } from "@resolver/models/types";
import { flatten } from "lodash";

export abstract class ResolverService {

    allNetworksSupported = false;

    abstract network: Network;

    abstract nodeLink: string;

    abstract vendor: ResolverServices;

    abstract resolve(domain: string, networks?: RequestedNetwork[]): Promise<Account[]>;
}
