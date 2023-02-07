import type { Account, AccountRecord, Resolver } from "@resolver/models/types";
import type { Network, ResolverOptions, ResolverServices, RedefinedReverse, Nodes } from "@resolver/models/types";
import type { ResolverService } from "@resolver/services/resolvers/resolver.service";
import { RedefinedResolverService } from "@resolver/services/resolvers/redefined-resolver.service";
import { EnsResolverService } from "@resolver/services/resolvers/ens-resolver.service";
import { UnstoppableResolverService } from "@resolver/services/resolvers/unstoppable-resolver.service";
import { flatten } from "lodash";
import { EthereumProvider } from "@resolver/services/providers/ethereum.provider";
import config from "@resolver/config";

const redefinedResolverService = new RedefinedResolverService();
const ensResolverService = new EnsResolverService();
const unstoppableResolverService = new UnstoppableResolverService();

const resolverServicesByType: { [key in ResolverServices]: ResolverService } = {
    redefined: redefinedResolverService,
    ens: ensResolverService,
    unstoppable: unstoppableResolverService,
}

export class RedefinedResolver implements Resolver {

    private resolverServices: ResolverService[] = [ redefinedResolverService, ensResolverService, unstoppableResolverService ];

    private nodes: Nodes = {
        eth: config.ETH_NODE,
        bsc: config.BSC_NODE,
        sol: config.SOL_NODE,
    };

    constructor(
      public options?: ResolverOptions
    ) {
        const resolverServices = this.options?.resolverServices;
        const nodes = this.options?.nodes;

        if (resolverServices && !resolverServices.length) {
            throw Error("“resolverServices” option must be a non-empty array or falsy")
        }

        if (nodes && !Object.keys(nodes).length) {
            throw Error("“nodes” option must be a non-empty array or falsy")
        }

        if (resolverServices) {
            this.resolverServices = resolverServices.map(it => resolverServicesByType[it]);
        }

        if (nodes) {
            this.nodes = { ...this.nodes, ...nodes };
        }
    }

    async resolve(domain: string, networks?: Network[]): Promise<Account[]> {
        return flatten(await Promise.all(this.resolverServices.map(resolver =>
          resolver.resolveAll(domain, this.nodes)
        ))).filter(it => !networks || networks.includes(it.network));
    }

    async reverse(): Promise<string[]> {
        return EthereumProvider.reverse();
    }

    async register(domainHash: string, redefinedSign: string, records: AccountRecord[], newReverse: RedefinedReverse): Promise<void> {
        return EthereumProvider.sendTransferToRegister(domainHash, redefinedSign, records, newReverse);
    }

    async update(domainHash: string, records: Account[]): Promise<void> {
        return EthereumProvider.sendTransferToUpdate(domainHash, records);
    }
}
