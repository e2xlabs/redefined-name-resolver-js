import { ResolverService } from "@/services/resolvers/resolver.service";
import { Network, Account, RedefinedRevers } from "@/models/types";
import EvmWeb3Service from "@/services/web3/evm-web3.service";
import redefinedResolverAbi from "@/services/abis/redefined-resolver.abi";

const web3 = EvmWeb3Service.getWeb3("bsc");
// TODO: add contract address when available
const contract = new web3.eth.Contract(redefinedResolverAbi, "contract_address");

export class RedefinedResolverService implements ResolverService {

    async resolve(domain: string): Promise<Account[]> {
        return await contract.methods.resolve(domain).call();
    }

    async register(domainHash: string, redefinedSign: string, records: Account[], newRevers: RedefinedRevers[]): Promise<void> {
        return await contract.methods.register(domainHash, redefinedSign, records, newRevers).send();
    }
    
    async update(domainHash: string, records: Account[]): Promise<void> {
        return await contract.methods.update(domainHash, records).send();
    }
}
