import { ResolverService } from "@/services/resolvers/resolver.service";
import { SetAddressOptions } from "@/models/types";

export class RedefinedResolverService implements ResolverService {

    async getAddresses(domain: string): Promise<string[]> {
        return [];
    }

    async getDomains(address: string): Promise<string[]> {
        return [];
    }

    async setAddress(domain: string, options: SetAddressOptions) {
        return true;
    }
}
