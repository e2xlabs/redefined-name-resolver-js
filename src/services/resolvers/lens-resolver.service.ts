import { ResolverService } from "@resolver/services/resolvers/resolver.service";
import type { Account } from "@resolver/models/types";
import { ResolverVendor } from "@resolver/models/types";

export class LensResolverService extends ResolverService {

    get vendor(): ResolverVendor {
        return "lens";
    }

    constructor(private apiUrl: string) {
        super()

    }

    async resolve(domain: string): Promise<Account[]> {
        const preparedDomain = domain.endsWith(".lens") ? domain : `${domain}.lens`

        try {

            const { data, errors } = await (await fetch(this.apiUrl, {
                method: 'POST',

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    query: `
                        query Profile {
                            profile(request: { handle: "${preparedDomain}" }) {
                                ownedBy
                            }
                        }
                    `,
                })
            })).json() as any

            if(errors?.find((it: any) => it.message.includes("Handle must be"))) {
                throw Error("Incorrect domain");
            }
            else if(errors && errors.length) {
                throw Error(JSON.stringify(errors))
            }
            else if(!data) {
                throw Error("Unexpected error")
            }

            if(!data.profile) throw Error(`${preparedDomain} is not registered`)

            return [{
                address: data.profile.ownedBy,
                network: "evm",
                from: this.vendor,
            }];

        } catch (e: any) {

            throw Error(`Lens Error: ${e.message}`);
        }
    }
}
