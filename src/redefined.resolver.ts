import type { Account, Resolver } from "@/models/types";
import { Network, ResolverOptions, ResolverServices, RedefinedRevers } from "@/models/types";
import { ResolverService } from "@/services/resolvers/resolver.service";
import { RedefinedResolverService } from "@/services/resolvers/redefined-resolver.service";
import { EnsResolverService } from "@/services/resolvers/ens-resolver.service";
import { UnstoppableResolverService } from "@/services/resolvers/unstoppable-resolver.service";
import { flatten } from "lodash";
import { RedefinedProvider } from "@/services/providers/redefined.provider";

const redefinedResolverService = new RedefinedResolverService();
const ensResolverService = new EnsResolverService();
const unstoppableResolverService = new UnstoppableResolverService();

const resolverServicesByType: { [key in ResolverServices]: ResolverService } = {
    redefined: redefinedResolverService,
    ens: ensResolverService,
    unstoppable: unstoppableResolverService,
}

export class RedefinedResolver implements Resolver {

    private resolverServices: ResolverService[];

    constructor(
      public options?: ResolverOptions
    ) {
        const resolverServices = this.options?.resolverServices;

        if (resolverServices && !resolverServices.length) {
            throw Error("You need to provide the resolvers you want to use or provide nothing!")
        }

        this.resolverServices = resolverServices
            ? resolverServices.map(it => resolverServicesByType[it])
            : [ redefinedResolverService, ensResolverService, unstoppableResolverService ];
    }

    async resolve(domain: string, network: Network): Promise<Account[]> {
        return flatten(await Promise.all(this.resolverServices.map(resolver => resolver.resolve(domain, network))));
    }

    async reverse(): Promise<string[]> {
        const reverse = await RedefinedProvider.reverse();
        return [];
    }

    async register(domainHash: string, redefinedSign: string, records: Account[], newRevers: RedefinedRevers[]): Promise<void> {
        return redefinedResolverService.register(domainHash, redefinedSign, records, newRevers);
    }
    
    async update(domainHash: string, records: Account[]): Promise<void> {
        return redefinedResolverService.update(domainHash, records);
    }
}
