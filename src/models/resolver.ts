import type { ResolverModel } from "@/models/types";
import { Chain, ResolverOptions, ResolverServices } from "@/models/types";
import { ResolverService } from "@/services/resolvers/resolver.service";
import { RedefinedResolverService } from "@/services/resolvers/redefined-resolver.service";
import { EnsResolverService } from "@/services/resolvers/ens-resolver.service";
import { UnstoppableResolverService } from "@/services/resolvers/unstoppable-resolver.service";
import { flatten } from "lodash";

const redefinedResolverService = new RedefinedResolverService();
const ensResolverService = new EnsResolverService();
const unstoppableResolverService = new UnstoppableResolverService();

export class Resolver implements ResolverModel {

    private services: ResolverService[];

    constructor(
      public options: ResolverOptions
    ) {
        const usedServices = this.options.usedServices;

        if (usedServices && !usedServices.length) {
            throw Error("You need to provide the services you want to use or provide nothing!")
        }

        this.services = !usedServices
            ? [ redefinedResolverService, ensResolverService, unstoppableResolverService ]
            : [
              usedServices.some(it => it === ResolverServices.REDEFINED) && redefinedResolverService,
              usedServices.some(it => it === ResolverServices.ENS) && ensResolverService,
              usedServices.some(it => it === ResolverServices.UNSTOPPABLE) && unstoppableResolverService,
            ].filter(it => it);
    }

    async getAddresses(domain: string, chain: Chain) {
        return flatten(await Promise.all(this.services.map(resolver => resolver.getAddresses(domain, chain))));
    }

    async getDomains(address: string, chain: Chain) {
        return [];
    }
}
