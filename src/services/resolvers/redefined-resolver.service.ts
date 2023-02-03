import type { ResolverService } from "@resolver/services/resolvers/resolver.service";
import type { Account, RedefinedRevers } from "@resolver/models/types";
import EvmWeb3Service from "@resolver/services/web3/evm-web3.service";
import redefinedResolverAbi from "@resolver/services/abis/redefined-resolver.abi";
import config from "@resolver/config";

const web3 = EvmWeb3Service.getWeb3("eth");
const contract = new web3.eth.Contract(redefinedResolverAbi, config.CONTRACT_ADDRESS);

export class RedefinedResolverService implements ResolverService {

    async resolve(domain: string): Promise<Account[]> {
        try {
            return await contract.methods.resolve(domain).call();
        } catch (e: any) {
            console.error("redefined Error", e.message);
            return [];
        }
    }

    async register(domainHash: string, redefinedSign: string, records: Account[], newRevers: RedefinedRevers[]): Promise<void> {
        return await contract.methods.register(domainHash, redefinedSign, records, newRevers).send();
    }

    async update(domainHash: string, records: Account[]): Promise<void> {
        return await contract.methods.update(domainHash, records).send();
    }
}
