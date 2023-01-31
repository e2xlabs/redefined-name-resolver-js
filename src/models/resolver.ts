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

export class Resolver implements ResolverI {

    private servicesToResolveDomains: ResolverService[];

    constructor(
      public options: ResolverOptions
    ) {
        const usedServices = this.options.servicesToResolveDomains;

        if (usedServices && !usedServices.length) {
            throw Error("You need to provide the services you want to use or provide nothing!")
        }

        this.servicesToResolveDomains = !usedServices
            ? [ redefinedResolverService, ensResolverService, unstoppableResolverService ]
            : [
              usedServices.some(it => it === ResolverServices.REDEFINED) && redefinedResolverService,
              usedServices.some(it => it === ResolverServices.ENS) && ensResolverService,
              usedServices.some(it => it === ResolverServices.UNSTOPPABLE) && unstoppableResolverService,
            ].filter(it => it);
    }

    async getAddresses(domain: string, chain: Chain): Promise<string[]> {
        return flatten(await Promise.all(this.servicesToResolveDomains.map(resolver => resolver.getAddresses(domain, chain))));
    }

    async getDomains(address: string, chain: Chain): Promise<string[]> {
        return redefinedResolverService.getDomains(address);
    }

    async setAddress(domain: string, options: SetAddressOptions): Promise<any> {
        return redefinedResolverService.setAddress(domain, options);
    }
}
