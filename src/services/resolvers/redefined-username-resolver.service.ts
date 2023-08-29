import type { AccountRecord, ReverseAccount } from "@resolver/models/types";
import config from "@resolver/config";
import EvmWeb3Service from "@resolver/services/web3/evm-web3.service";
import redefinedNicknameResolverAbi from "@resolver/services/abis/redefined-nickname-resolver.abi";
import { RedefinedResolverService } from "@resolver/services/resolvers/redefined-resolver.service";
import { ResolverVendor } from "@resolver/models/types";
import { SupportReverse } from "./resolver.service";

export class RedefinedUsernameResolverService extends RedefinedResolverService implements SupportReverse {
    
    get vendor(): ResolverVendor {
        return "redefined-username";
    }

    private contract: any;

    
    constructor(
        public node: string,
        public allowDefaultEvmResolves: boolean,
    ) {
        super(allowDefaultEvmResolves);

        const web3 = EvmWeb3Service.getWeb3(this.node);
        this.contract = new web3.eth.Contract(redefinedNicknameResolverAbi, config.REDEFINED_NICKNAME_RESOLVER_CONTRACT_ADDRESS);
    }

    async resolveDomain(domain: string): Promise<AccountRecord[]> {
        return await this.contract.methods.resolve(domain).call();
    }

    async reverse(address: string): Promise<ReverseAccount[]> {
        return [
            ...(await this.contract.methods.fetchBindedDomainsToAddress(address).call()),
            ...(await this.contract.methods.fetchBindedDomainsToAddress(address.toLocaleLowerCase()).call())
        ].map((it: string) => ({
            domain: it,
            from: this.vendor
        }));
    }
}
