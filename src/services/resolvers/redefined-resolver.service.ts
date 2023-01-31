import { ResolverService } from "@/services/resolvers/resolver.service";
import { Chain, SetAddressOptions } from "@/models/types";
import EvmWeb3Service from "@/services/web3/evm-web3.service";

// const web3 = EvmWeb3Service.getWeb3(Chain.BSC);

// TODO: add abi when available
// const contract = new web3.eth.Contract(abi, "contract_address");

export class RedefinedResolverService implements ResolverService {

    async resolve(domain: string): Promise<string[]> {
        // return await contract.methods.resolve(domain).call();
        return [];
    }

    async reverse(address: string): Promise<string[]> {
        // return await contract.methods.reverse(address).call();
        return [];
    }

    async register(domain: string, options: SetAddressOptions) {
        // return await contract.methods.register(domain, options).call();
        return [];
    }
}
