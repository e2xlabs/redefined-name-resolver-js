import type { Account, ResolverServices } from "@resolver/models/types";

export type ResolverServiceOptions = {
    throwErrorOnInvalidDomain: boolean,
    [key: string]: any,
}

export const defaultResolverServiceOptions: ResolverServiceOptions = {
    throwErrorOnInvalidDomain: true,
}

export abstract class ResolverService {

    abstract vendor: ResolverServices;

    abstract resolve(domain: string, options?: ResolverServiceOptions, networks?: string[]): Promise<Account[]>;
}
