import type { Account, ResolverServices } from "@resolver/models/types";

export abstract class ResolverService {

    abstract vendor: ResolverServices;
    
    abstract resolve(domain: string, throwErrorOnIllegalCharacters: boolean, networks?: string[]): Promise<Account[]>;
}
