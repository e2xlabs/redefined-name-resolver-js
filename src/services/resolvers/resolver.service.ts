import { SetAddressOptions } from "@/models/types";

export interface ResolverService {
    getAddresses(alias: string): Promise<string[]>;

    setAddress(alias: string, address: string, options: SetAddressOptions);
}
