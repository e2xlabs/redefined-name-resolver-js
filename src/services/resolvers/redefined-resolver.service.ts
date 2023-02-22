import { ResolverService } from "@resolver/services/resolvers/resolver.service";
import type { Account, AccountRecord, Network } from "@resolver/models/types";
import config from "@resolver/config";
import { sha256 } from "js-sha256";
import EvmWeb3Service from "@resolver/services/web3/evm-web3.service";
import { EmailService } from "@resolver/services/email.service";
import redefinedEmailResolverAbi from "@resolver/services/abis/redefined-email-resolver.abi";
import redefinedNicknameResolverAbi from "@resolver/services/abis/redefined-nickname-resolver.abi";

export class RedefinedResolverService extends ResolverService {
    
    constructor(
        public nodeLink: string,
        public network: Network,
    ) {
        super();
    }

    async resolve(domain: string): Promise<Account[]> {
        try {
            const resolve = EmailService.isEmail(domain)
              ? this.resolveEmail(domain)
              : this.resolveNickname(domain);

            return (await resolve).map(it => ({
                address: it.addr,
                network: it.network,
                from: "redefined"
            }));
        } catch (e: any) {
            throw Error(`redefined Error: ${e.message}`);
        }
    }

    private async resolveEmail(domain: string): Promise<AccountRecord[]> {
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

    private async resolveNickname(domain: string): Promise<AccountRecord[]> {
        try {
            const web3 = EvmWeb3Service.getWeb3(this.nodeLink);
            const contract = new web3.eth.Contract(redefinedNicknameResolverAbi, config.REDEFINED_NICKNAME_RESOLVER_CONTRACT_ADDRESS);
            return await contract.methods.resolve(domain).call();
        } catch (e: any) {
            if (e.message.includes("Name is not registered")) {
                return [];
            }
            throw Error(`redefined Error: ${e.message}`);
        }
    }
}
