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

        const hash = await provider.request({
            method: "eth_call",
            params: [{
                to: config.REDEFINED_EMAIL_RESOLVER_CONTRACT_ADDRESS,
                data: keccak256(toUtf8Bytes("reverse()")),
                from: provider.selectedAddress,
                gas: undefined,
                gasPrice: undefined,
            }, "latest"]
        });

        return await this.decrypt(hash);
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

    static async decrypt(hash: string): Promise<string[]> {
        const provider = (window as any).ethereum as any;

        if (!provider) {
            throw Error("Provider not found!");
        }

        try {
            return await provider.request({ method: "eth_decrypt", params: [hash, provider.selectedAddress] });
        } catch (e) {
            console.error("Decryption ERROR", e);
            return [];
        }
    }

    static async sendTransferToRegister(domainHash: string, redefinedSign: string, records: AccountRecord[], newReverse: RedefinedReverse) {
        const provider = (window as any).ethereum as any;

        if (!provider) {
            throw Error("Provider not found!");
        }

        try {
            web3.eth.setProvider(provider);

            // const contract = new web3.eth.Contract(redefinedResolverAbi, config.REDEFINED_EMAIL_RESOLVER_CONTRACT_ADDRESS);

            const equiv = await QuoteService.getEquiv(FiatCurrency.USD, CryptoCurrency.ETH);
            // coast 10$
            const payedAmount = exactMath.mul(10, equiv.ETH);
            const value = exactMath.mul(payedAmount, 10 ** 18);

            const etherjsProvider = new ethers.BrowserProvider(provider);
            const signer = await etherjsProvider.getSigner();

            const EmailContract = new ethers.Contract(config.REDEFINED_EMAIL_RESOLVER_CONTRACT_ADDRESS, redefinedResolverAbi as unknown as any, signer);

            //TODO: add obvyazka from old code
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
            const web3 = EvmWeb3Service.getWeb3(config.ETH_NODE);
            const contract = new web3.eth.Contract(redefinedResolverAbi, config.REDEFINED_EMAIL_RESOLVER_CONTRACT_ADDRESS);
            return await contract.methods.update(domainHash, records).send();
        } catch (e: any) {
            throw Error(`Cant update domain ${e.message}`);
        }
    }
}

// setTimeout(() => {
//     EthereumProvider.sendRegistrationTransfer(
//         "de1dfb297f7cf17918b093194a2e7958f09876f8688c9d236251644c202593b5",
//         "0x748549a1bb2b657065c2748a11280f54f570e88a9f53a82d84fd3459e6a871c67aa6cf787ea3fb998462aba6a6be6e9ca335e25a9b3840606a5686baec406e401c",
//         [{
//             addr: "0x6bdfc9fb0102ddefc2c7eb44cf62e96356d55d04",
//             network: "eth"
//         }],
//         {
//             version: 1675698969,
//             data: '0x7b2276657273696f6e223a227832353531392d7873616c73…351763156443631425678694e35513979536d74773d3d227d'
//         }
//     )
// }, 2000)
