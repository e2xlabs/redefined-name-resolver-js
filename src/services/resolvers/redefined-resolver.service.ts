import { ResolverService } from "@resolver/services/resolvers/resolver.service";
import type { Account, AccountRecord, Network, Nodes } from "@resolver/models/types";
import EvmWeb3Service from "@resolver/services/web3/evm-web3.service";
import redefinedResolverAbi from "@resolver/services/abis/redefined-resolver.abi";
import config from "@resolver/config";

export class RedefinedResolverService extends ResolverService {

    getSupportedNetworks(): Network[] {
        return ["eth", "bsc", "sol"];
    }

    async resolve(domain: string, network: Network, nodeLink: string): Promise<Account[]> {
        if (!this.getSupportedNetworks().some(it => it === network)) {
            console.log(`${network} not supported by redefined.`);
            return [];
        }

        try {
            const web3 = EvmWeb3Service.getWeb3(nodeLink);
            const contract = new web3.eth.Contract(redefinedResolverAbi, config.REDEFINED_EMAIL_RESOLVER_CONTRACT_ADDRESS);
            return (await contract.methods.resolve(domain).call()).map((it: AccountRecord) => ({
                address: it.addr,
                network: it.network,
            }));
        } catch (e: any) {
            console.error("redefined Error", e.message);
            return [];
        }
    }
}
