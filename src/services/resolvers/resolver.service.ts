import { Network, ResolvedAddress } from "@/models/types";

export interface ResolverService {
    resolve(alias: string, network: Network): Promise<ResolvedAddress[]>;
}
