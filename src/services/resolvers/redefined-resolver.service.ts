import { ResolverService } from "@resolver/services/resolvers/resolver.service";
import type { Account, AccountRecord, Network } from "@resolver/models/types";
import config from "@resolver/config";
import { sha256 } from "js-sha256";
import EvmWeb3Service from "@resolver/services/web3/evm-web3.service";
import { EmailService } from "@resolver/services/email.service";
import redefinedEmailResolverAbi from "@resolver/services/abis/redefined-email-resolver.abi";
import redefinedNicknameResolverAbi from "@resolver/services/abis/redefined-nickname-resolver.abi";

export class RedefinedResolverService extends ResolverService {

    async resolve(domain: string, network: Network, nodeLink: string): Promise<Account[]> {
        try {
            const resolve = EmailService.isEmail(domain)
              ? this.resolveEmail(domain, nodeLink)
              : this.resolveNickname(domain, nodeLink);

            return (await resolve).map(it => ({
                address: it.addr,
                network: it.network,
                from: "redefined"
            }));
        } catch (e: any) {
            throw Error(`redefined Error: ${e.message}`);
        }
    }

    private async resolveEmail(domain: string, nodeLink: string): Promise<AccountRecord[]> {
        try {
            const web3 = EvmWeb3Service.getWeb3(nodeLink);
            const contract = new web3.eth.Contract(redefinedEmailResolverAbi, config.REDEFINED_EMAIL_RESOLVER_CONTRACT_ADDRESS);
            return await contract.methods.resolve(sha256(domain)).call();
        } catch (e: any) {
            if (e.message.includes("Name is not registered")) {
                return [];
            }
            throw Error(`redefined Error: ${e.message}`);
        }
    }

    private async resolveNickname(domain: string, nodeLink: string): Promise<AccountRecord[]> {
        try {
            const web3 = EvmWeb3Service.getWeb3(nodeLink);
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
