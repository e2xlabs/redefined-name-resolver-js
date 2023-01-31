import { Chain } from "@/models/types";

export interface ResolverService {
    getAddresses(alias: string, chain?: Chain): Promise<string[]>;
}
