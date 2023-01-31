import { Chain } from "@/models/types";

export interface ResolverService {
    resolve(alias: string, chain?: Chain): Promise<string[]>;
}
