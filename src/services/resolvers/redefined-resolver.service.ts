import type { ResolverService } from "@resolver/services/resolvers/resolver.service";
import type { Account, AccountRecord, RedefinedRevers } from "@resolver/models/types";
import EvmWeb3Service from "@resolver/services/web3/evm-web3.service";
import redefinedResolverAbi from "@resolver/services/abis/redefined-resolver.abi";
import config from "@resolver/config";
import { EthereumProvider } from "@resolver/services/providers/ethereum.provider";

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

    // async register(domainHash: string, redefinedSign: string, records: AccountRecord[], newRevers: RedefinedRevers): Promise<void> {
    //     await EthereumProvider.sendTransfer("")
    //     // try {
    //     //     return await contract.methods.register(domainHash, redefinedSign, records, newRevers).send();
    //     // } catch (e: any) {
    //     //     throw Error(`Cant register domain ${e.message}`);
    //     // }
    // }

    async update(domainHash: string, records: Account[]): Promise<void> {
        try {
            return await contract.methods.update(domainHash, records).send();
        } catch (e: any) {
            throw Error(`Cant update domain ${e.message}`);
        }
    }
}
