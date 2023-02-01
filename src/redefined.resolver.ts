import type { ResolvedAddress, Resolver } from "@/models/types";
import { Network, ResolverOptions, ResolverServices, SetAddressOptions } from "@/models/types";
import { ResolverService } from "@/services/resolvers/resolver.service";
import { RedefinedResolverService } from "@/services/resolvers/redefined-resolver.service";
import { EnsResolverService } from "@/services/resolvers/ens-resolver.service";
import { UnstoppableResolverService } from "@/services/resolvers/unstoppable-resolver.service";
import { flatten } from "lodash";

const redefinedResolverService = new RedefinedResolverService();
const ensResolverService = new EnsResolverService();
const unstoppableResolverService = new UnstoppableResolverService();

const resolverServicesByType: { [key in keyof typeof ResolverServices]: ResolverService } = {
    [ResolverServices.REDEFINED]: redefinedResolverService,
    [ResolverServices.ENS]: ensResolverService,
    [ResolverServices.UNSTOPPABLE]: unstoppableResolverService,
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

    async resolve(domain: string, network: Network): Promise<ResolvedAddress[]> {
        return flatten(await Promise.all(this.resolverServices.map(resolver => resolver.resolve(domain, network))));
    }

    async reverse(address: string, network: Network): Promise<string[]> {
        return redefinedResolverService.reverse(address);
    }

    async register(domain: string, options: SetAddressOptions): Promise<any> {
        return redefinedResolverService.register(domain, options);
    }
}
