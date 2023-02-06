import type { ResolverService } from "@resolver/services/resolvers/resolver.service";
import type { Account, Network } from "@resolver/models/types";
import EvmWeb3Service from "@resolver/services/web3/evm-web3.service";
import redefinedResolverAbi from "@resolver/services/abis/redefined-resolver.abi";
import config from "@resolver/config";


export class RedefinedResolverService implements ResolverService {

    async resolve(domain: string, network: Network, nodeLink: string): Promise<Account[]> {
        try {
            const web3 = EvmWeb3Service.getWeb3(nodeLink);
            const contract = new web3.eth.Contract(redefinedResolverAbi, config.CONTRACT_ADDRESS);
            return await contract.methods.resolve(domain).call();
        } catch (e: any) {
            console.error("redefined Error", e.message);
            return [];
        }
    }

    async update(domainHash: string, records: Account[]): Promise<void> {
        try {
            const web3 = EvmWeb3Service.getWeb3(config.ETH_NODE);
            const contract = new web3.eth.Contract(redefinedResolverAbi, config.CONTRACT_ADDRESS);
            return await contract.methods.update(domainHash, records).send();
        } catch (e: any) {
            throw Error(`Cant update domain ${e.message}`);
        }
    }
}
