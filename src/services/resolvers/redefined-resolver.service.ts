import { ResolverService } from "@resolver/services/resolvers/resolver.service";
import type { Account, AccountRecord, Network, Nodes } from "@resolver/models/types";
import redefinedResolverAbi from "@resolver/services/abis/redefined-resolver.abi";
import config from "@resolver/config";
import { ethers } from "ethers";
import { isEmail } from "@resolver/utils/utils";
import { sha256 } from "js-sha256";

export class RedefinedResolverService extends ResolverService {

    getSupportedNetworks(): Network[] {
        return ["eth"];
    }

    async resolve(domain: string, network: Network, nodeLink: string): Promise<Account[]> {
        if (!this.getSupportedNetworks().some(it => it === network)) {
            console.log(`${network} not supported by redefined.`);
            return [];
        }
    
        const provider = (window as any).ethereum as any;

        if (!provider) {
            throw Error("Provider not found!");
        }

        try {
            const etherjsProvider = new ethers.BrowserProvider(provider);
            const signer = await etherjsProvider.getSigner();
            const EmailContract = new ethers.Contract(config.REDEFINED_EMAIL_RESOLVER_CONTRACT_ADDRESS, redefinedResolverAbi, signer);
            return (await EmailContract.resolve(isEmail(domain) ? sha256(domain) : domain)).map((it: AccountRecord) => ({
                address: it.addr,
                network: it.network,
                from: "redefined"
            }));
        } catch (e: any) {
            console.error("redefined Error", e.message);
            return [];
        }
    }
}
