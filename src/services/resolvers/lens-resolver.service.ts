import { ResolverService } from "@resolver/services/resolvers/resolver.service";
import type { Account, ReverseAccount } from "@resolver/models/types";
import { ResolverVendor } from "@resolver/models/types";
import EvmWeb3Service from "@resolver/services/web3/evm-web3.service";

export class LensResolverService extends ResolverService {

    get vendor(): ResolverVendor {
        return "lens";
    }

    constructor(private apiUrl: string) {
        super()
    }

    async resolve(domain: string): Promise<Account[]> {
        try {
            if (!domain.endsWith(".lens")) {
                throw Error(`${domain} is not supported`);
            }

            const { data, errors } = await (await fetch(this.apiUrl, {
                method: 'POST',

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    query: `
                        query Profile {
                            profile(request: { handle: "${domain}" }) {
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

            if(!data.profile) throw Error(`${domain} is not registered`)

            return [{
                address: data.profile.ownedBy,
                network: "evm",
                from: this.vendor,
            }];

        } catch (e: any) {

            throw Error(`Lens Error: ${e.message}`);
        }
    }

    async reverse(address: string): Promise<ReverseAccount[]> {
        try {
            if (!EvmWeb3Service.isValidAddress(address)) {
                throw Error(`Invalid address: ${address}`);
            }

            const { data, errors } = await (await fetch(this.apiUrl, {
                method: 'POST',

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    query: `
                        query Profiles {
                            profiles(request: { ownedBy: ["${address}"] }) {
                                items { handle }
                        }
                    }
                    `,
                })
            })).json() as any


            if(errors && errors.length) {
                throw Error(JSON.stringify(errors))
            }
            else if(!data) {
                throw Error("Unexpected error")
            }

            if(data && data.profiles && data.profiles.items) {
                return data.profiles.items.map(it => ({
                    domain: it.handle,
                    network: "evm",
                    from: this.vendor
                }))
            } else throw Error(`${address} is not registered`);
        } catch (e: any) {
            throw Error(`Lens Error: ${e.message}`);
        }
    }
}
