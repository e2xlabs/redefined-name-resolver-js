import type { ResolverModel } from "@/models/types"
import { Chain } from "@/models/types";

class Resolver implements ResolverModel {
    getAliasAddresses(alias: string) {
        return [];
    }
    getAddressAliases(address: string, chain: Chain) {
        return [];
    }
}
export const resolver = new Resolver();
