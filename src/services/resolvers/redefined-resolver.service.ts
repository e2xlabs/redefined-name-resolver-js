import { ResolverService } from "@/services/resolvers/resolver.service";
import { Network, ResolvedAddress, SetAddressOptions } from "@/models/types";
import EvmWeb3Service from "@/services/web3/evm-web3.service";
import redefinedResolverAbi from "@/services/abis/redefined-resolver.abi";

const web3 = EvmWeb3Service.getWeb3(Network.BSC);
// TODO: add contract address when available
const contract = new web3.eth.Contract(redefinedResolverAbi, "contract_address");

export class RedefinedResolverService implements ResolverService {

    async resolve(domain: string): Promise<ResolvedAddress[]> {
        return await contract.methods.resolve(domain).call();
    }

    async register(domain: string, options: SetAddressOptions) {
        return await contract.methods.register(domain, options).send();
    }
    
    async update(domain: string, options: SetAddressOptions) {
        return await contract.methods.update(domain, options).send();
    }
}
