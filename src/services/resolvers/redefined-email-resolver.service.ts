import type { AccountRecord } from "@resolver/models/types";
import config from "@resolver/config";
import { sha256 } from "js-sha256";
import EvmWeb3Service from "@resolver/services/web3/evm-web3.service";
import redefinedEmailResolverAbi from "@resolver/services/abis/redefined-email-resolver.abi";
import { RedefinedResolverService } from "@resolver/services/resolvers/redefined-resolver.service";
import { RedefinedReverseResponse, ResolverVendor } from "@resolver/models/types";

export class RedefinedEmailResolverService extends RedefinedResolverService {

    get vendor(): ResolverVendor {
        return "redefined-email";
    }
    
    constructor(
        public node: string,
        public allowDefaultEvmResolves: boolean,
    ) {
        super(allowDefaultEvmResolves);
    }

    async resolveDomain(domain: string): Promise<AccountRecord[]> {
        const web3 = EvmWeb3Service.getWeb3(this.node);
        const contract = new web3.eth.Contract(redefinedEmailResolverAbi, config.REDEFINED_EMAIL_RESOLVER_CONTRACT_ADDRESS);
        return await contract.methods.resolve(sha256(domain)).call();
    }

    async reverseAddress(address: string): Promise<RedefinedReverseResponse> {
        throw Error("Unsupported method");
    }
}

