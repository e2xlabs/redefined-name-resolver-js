import type { AccountRecord } from "@resolver/models/types";
import config from "@resolver/config";
import EvmWeb3Service from "@resolver/services/web3/evm-web3.service";
import redefinedNicknameResolverAbi from "@resolver/services/abis/redefined-nickname-resolver.abi";
import { RedefinedResolverService } from "@resolver/services/resolvers/redefined-resolver.service";

export class RedefinedUsernameResolverService extends RedefinedResolverService {

    constructor(
        public node: string,
        public allowDefaultEvmResolves: boolean,
    ) {
        super(allowDefaultEvmResolves);
    }

    async resolveDomain(domain: string): Promise<AccountRecord[]> {
        const web3 = EvmWeb3Service.getWeb3(this.node);
        const contract = new web3.eth.Contract(redefinedNicknameResolverAbi, config.REDEFINED_NICKNAME_RESOLVER_CONTRACT_ADDRESS);
        return await contract.methods.resolve(domain).call();
    }
}
