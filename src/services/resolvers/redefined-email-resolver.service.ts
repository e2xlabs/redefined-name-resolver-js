import type { AccountRecord, Network } from "@resolver/models/types";
import config from "@resolver/config";
import { sha256 } from "js-sha256";
import EvmWeb3Service from "@resolver/services/web3/evm-web3.service";
import redefinedEmailResolverAbi from "@resolver/services/abis/redefined-email-resolver.abi";
import { RedefinedResolverService } from "@resolver/services/resolvers/redefined-resolver.service";

export class RedefinedEmailResolverService extends RedefinedResolverService {

    constructor(
      public nodeLink: string,
      public network: Network,
      public allowDefaultEvmResolves: boolean,
    ) {
        super(allowDefaultEvmResolves);
    }

    async resolveDomain(domain: string): Promise<AccountRecord[]> {
        try {
            const web3 = EvmWeb3Service.getWeb3(this.nodeLink);
            const contract = new web3.eth.Contract(redefinedEmailResolverAbi, config.REDEFINED_EMAIL_RESOLVER_CONTRACT_ADDRESS);
            return await contract.methods.resolve(sha256(domain)).call();
        } catch (e: any) {
            if (e.message.includes("Name is not registered")) {
                return [];
            }
            throw Error(`redefined Error: ${e.message}`);
        }
    }
}

