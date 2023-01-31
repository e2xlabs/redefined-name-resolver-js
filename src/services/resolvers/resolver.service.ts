import { Chain, SetAddressOptions } from "@/models/types";

export interface ResolverService {
    supportedChains: Chain[];

    getAddresses(alias: string, chain?: Chain): Promise<string[]>;

    setAddress(alias: string, address: string, options: SetAddressOptions);
}
