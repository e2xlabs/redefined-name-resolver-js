import config from "@resolver/config";
import { keccak256, toUtf8Bytes, hexlify, ethers } from "ethers";
import { encrypt } from "eth-sig-util";
import EvmWeb3Service from "@resolver/services/web3/evm-web3.service";
import redefinedResolverAbi from "@resolver/services/abis/redefined-resolver.abi";
import type { AccountRecord, RedefinedReverse } from "@resolver/models/types";
import { QuoteService } from "@resolver/services/quote.service";
import { Account, CryptoCurrency, FiatCurrency } from "@resolver/models/types";
import * as exactMath from "exact-math";

const web3 = EvmWeb3Service.getWeb3(config.ETH_NODE);

export class EthereumProvider {
    static async callReverse(): Promise<string[]> {
        const provider = (window as any).ethereum as any;

        if (!provider) {
            throw Error("Provider not found!");
        }
        
        const etherjsProvider = new ethers.BrowserProvider(provider);
        const signer = await etherjsProvider.getSigner();
        const EmailContract = new ethers.Contract(config.REDEFINED_EMAIL_RESOLVER_CONTRACT_ADDRESS, redefinedResolverAbi, signer);
        try {
            const hash = await EmailContract.reverse()
            return JSON.parse(await this.decrypt(hash[1] || hash));
        } catch (e) {
            console.error("Cant parse decrypted message", e);
            return [];
        }
    }

    static async encrypt(data: string): Promise<string> {
        const provider = (window as any).ethereum as any;

        if (!provider) {
            throw Error("Provider not found!");
        }

        try {
            const encryptionPublicKey = await provider.request({ method: "eth_getEncryptionPublicKey", params: [provider.selectedAddress] });
            return hexlify(
                Buffer.from(
                    JSON.stringify(
                        encrypt(encryptionPublicKey, { data }, 'x25519-xsalsa20-poly1305')
                    )
                )
            );
        } catch (e) {
            throw Error("Cant get encrypted data!");
        }
    }

    static async decrypt(hash: string): Promise<string> {
        const provider = (window as any).ethereum as any;

        if (!provider) {
            throw Error("Provider not found!");
        }

        try {
            return await provider.request({ method: "eth_decrypt", params: [hash, provider.selectedAddress] });
        } catch (e) {
            console.error("Decryption ERROR", e);
            return "[]";
        }
    }

    static async sendTransferToRegister(domainHash: string, redefinedSign: string, records: AccountRecord[], newReverse: RedefinedReverse) {
        const provider = (window as any).ethereum as any;

        if (!provider) {
            throw Error("Provider not found!");
        }

        try {
            web3.eth.setProvider(provider);

            const equiv = await QuoteService.getEquiv(FiatCurrency.USD, CryptoCurrency.ETH);
            // coast 10$
            const payedAmount = exactMath.mul(10, equiv.ETH);
            const value = exactMath.mul(payedAmount, 10 ** 18);

            const etherjsProvider = new ethers.BrowserProvider(provider);
            const signer = await etherjsProvider.getSigner();

            const EmailContract = new ethers.Contract(config.REDEFINED_EMAIL_RESOLVER_CONTRACT_ADDRESS, redefinedResolverAbi, signer);

            try {
                await EmailContract.register(domainHash, redefinedSign, records, newReverse, { value })
            } catch (e: any) {
                console.error(e);
                throw Error(e.message || e.toString());
            }
        } catch (e: any) {
            console.error(e);
            throw Error(`Cant create transfer to register domain ${e.message}`);
        }
    }

    static async sendTransferToUpdate(domainHash: string, records: Account[]): Promise<void> {
        try {
            // TODO: add support later
            // const web3 = EvmWeb3Service.getWeb3(config.ETH_NODE);
            // const contract = new web3.eth.Contract(redefinedResolverAbi, config.REDEFINED_EMAIL_RESOLVER_CONTRACT_ADDRESS);
            // return await contract.methods.update(domainHash, records).send();
        } catch (e: any) {
            throw Error(`Cant update domain ${e.message}`);
        }
    }
}
