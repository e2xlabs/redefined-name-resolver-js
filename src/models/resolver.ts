import type { Resolver as ResolverI } from "@/models/types";
import { Chain, ResolverOptions, ResolverServices, SetAddressOptions } from "@/models/types";
import { ResolverService } from "@/services/resolvers/resolver.service";
import { RedefinedResolverService } from "@/services/resolvers/redefined-resolver.service";
import { EnsResolverService } from "@/services/resolvers/ens-resolver.service";
import { UnstoppableResolverService } from "@/services/resolvers/unstoppable-resolver.service";
import { flatten } from "lodash";

const redefinedResolverService = new RedefinedResolverService();
const ensResolverService = new EnsResolverService();
const unstoppableResolverService = new UnstoppableResolverService();

const resolversByType: { [key in keyof typeof ResolverServices]: ResolverService } = {
    [ResolverServices.REDEFINED]: redefinedResolverService,
    [ResolverServices.ENS]: ensResolverService,
    [ResolverServices.UNSTOPPABLE]: unstoppableResolverService,
}

export class Resolver implements ResolverI {

    private resolvers: ResolverService[];

    constructor(
      public options?: ResolverOptions
    ) {
        const resolvers = this.options?.resolvers;

        if (resolvers && !resolvers.length) {
            throw Error("You need to provide the resolvers you want to use or provide nothing!")
        }

        this.resolvers = resolvers
            ? resolvers.map(it => resolversByType[it])
            : [ redefinedResolverService, ensResolverService, unstoppableResolverService ];
    }

    async resolve(domain: string, chain: Chain): Promise<string[]> {
        return flatten(await Promise.all(this.resolvers.map(resolver => resolver.resolve(domain, chain))));
    }

    async reverse(address: string, chain: Chain): Promise<string[]> {
        return redefinedResolverService.reverse(address);
    }

    async register(domain: string, options: SetAddressOptions): Promise<any> {
        return redefinedResolverService.register(domain, options);
    }
}
