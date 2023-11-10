import { instanceOfSupportReverse, ResolverService } from "@resolver/services/resolvers/resolver.service";
import { Account, CustomResolverServiceOptions, ResolverVendor, ReverseAccount } from "@resolver/models/types";

export class BulkProxy<C extends any, R extends ResolverService> implements ResolverService {

    readonly vendor: ResolverVendor = "";

    private readonly configuredResolvers: R[] = [];

    private readonly allowableErrorMessages = new Map<ResolverVendor, string[]>([
        ["sid", ["Invalid name", "is not registered", "Invalid address"]],
        ["ens", ["Cant resolve", "Invalid address"]],
        ["unstoppable", ["is not registered", "is invalid", "is not supported", "Invalid address"]],
        ["bonfida", ["is not supported", "Invalid name account provided", "Invalid address"]],
        ["redefined-email", [
            "is not registered",
            "Invalid characters, allowed only lowercase alphanumeric and -_",
            "No records found for domain",
            "Unsupported method"
        ]],
        ["redefined-username", [
            "is not registered",
            "Invalid characters, allowed only lowercase alphanumeric and -_",
            "No records found for domain",
            "Name has incorrect length",
            "Name should be at least 4 characters",
            "Name should be at most 63 characters",
            "Name should start with a letter",
            "Invalid address"
        ]],
        ["lens", ["is not supported", "Incorrect domain", "Invalid address"]]
    ])

    constructor(configs: C[] | undefined, instanceRef: (config: C | undefined) => R) {
        this.configuredResolvers = configs?.map(n => instanceRef(n)) || [];
        this.configuredResolvers.push(instanceRef(undefined));
        this.vendor = this.configuredResolvers[0].vendor;
    }

    private async timeoutPromise<T>(promise: Promise<T>, timeoutMillis: number): Promise<T> {
        return Promise.race([
            promise,
            new Promise<T>((_, reject) => setTimeout(() => reject(new Error("Request execution time exceeded the limit")), timeoutMillis))
        ]);
    }

    async resolve(domain: string, networks?: string[], options?: CustomResolverServiceOptions): Promise<Account[]> {
        let lastError: any;
        for (let resolver of this.configuredResolvers) {
            try {
                return await this.timeoutPromise(resolver.resolve(domain, networks, options), 5000);
            } catch (e: any) {
                if (this.allowableErrorMessages.get(this.vendor)?.some(msg => e.message.includes(msg))) {
                    throw e;
                }
                lastError = e;
            }
        }
        throw lastError;
    }

    async reverse(address: string): Promise<ReverseAccount[]> {
        let lastError: any;
        for (let resolver of this.configuredResolvers) {
            try {
                if (!instanceOfSupportReverse(resolver)) return [];
                return await this.timeoutPromise(resolver.reverse(address), 5000);
            } catch (e: any) {
                if (this.allowableErrorMessages.get(this.vendor)?.some(msg => e.message.includes(msg))) {
                    throw e;
                }
                lastError = e;
            }
        }
        throw lastError;
    }
}