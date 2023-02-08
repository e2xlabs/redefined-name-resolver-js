import { ResolverService } from "@resolver/services/resolvers/resolver.service";
import type { Account, AccountRecord, Network } from "@resolver/models/types";
import redefinedResolverAbi from "@resolver/services/abis/redefined-resolver.abi";
import config from "@resolver/config";
import { isEmail } from "@resolver/utils/utils";
import { sha256 } from "js-sha256";
import EvmWeb3Service from "@resolver/services/web3/evm-web3.service";

export class RedefinedResolverService extends ResolverService {

    getSupportedNetworks(): Network[] {
        return ["eth"];
    }

    async resolve(domain: string, network: Network, nodeLink: string): Promise<Account[]> {
        if (!this.getSupportedNetworks().some(it => it === network)) {
            console.log(`${network} not supported by redefined.`);
            return [];
        }

        try {
            const web3 = EvmWeb3Service.getWeb3(nodeLink);
            const contract = new web3.eth.Contract(redefinedResolverAbi, config.REDEFINED_EMAIL_RESOLVER_CONTRACT_ADDRESS);
            return (await contract.methods.resolve(isEmail(domain) ? sha256(domain) : domain).call()).map((it: AccountRecord) => ({
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
