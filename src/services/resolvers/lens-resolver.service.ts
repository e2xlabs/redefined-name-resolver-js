import { ResolverService } from "@resolver/services/resolvers/resolver.service";
import type { Account } from "@resolver/models/types";
import { ResolverVendor } from "@resolver/models/types";
import { ApolloClient, InMemoryCache, gql, NormalizedCacheObject, NormalizedCache } from '@apollo/client/core'

export class LensResolverService extends ResolverService {

    get vendor(): ResolverVendor {
        return "lens";
    }

    constructor(private api: ApolloClient<NormalizedCacheObject>) {
        super()
    }

    async resolve(domain: string): Promise<Account[]> {

        try {

            const { data: { profile } } = await this.api.query({
                query: gql`
                    query Profile($handle: Handle!) {
                        profile(request: { handle: $handle }) {
                            ownedBy
                        }
                    }
                `,
                variables: { handle: domain }
            }) as any

            if(!profile) throw Error(`${domain} is not registered`)

            return [{
                address: profile.ownedBy,
                network: "evm",
                from: this.vendor,
            }];

        } catch (e: any) {

            if(e.networkError?.result?.errors?.find((it: any) => it.message.includes("Handle must be"))) {

                throw Error(`Lens Error: incorrect domain`);
            }
            else throw Error(`Lens Error: ${e.message}`);
        }
    }
}
