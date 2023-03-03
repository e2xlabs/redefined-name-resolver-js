import type { Account, ResolverVendor } from "@resolver/models/types";

export type ResolverServiceOptions = {
    throwErrorOnInvalidDomain: boolean,
    [key: string]: any,
}

export const defaultResolverServiceOptions: ResolverServiceOptions = {
    throwErrorOnInvalidDomain: true,
}

export abstract class ResolverService {

    abstract vendor: ResolverVendor;

    abstract resolve(domain: string, options?: ResolverServiceOptions, networks?: string[]): Promise<Account[]>;
}
