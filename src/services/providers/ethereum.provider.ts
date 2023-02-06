import config from "@resolver/config";
import { keccak256, toUtf8Bytes, hexlify } from "ethers";
import { encrypt } from "eth-sig-util";
import EvmWeb3Service from "@resolver/services/web3/evm-web3.service";
import redefinedResolverAbi from "@resolver/services/abis/redefined-resolver.abi";
import type { AccountRecord, RedefinedRevers } from "@resolver/models/types";
import { QuoteService } from "@resolver/services/quote.service";
import { CryptoCurrency, FiatCurrency } from "@resolver/models/types";
import * as exactMath from "exact-math";

const web3 = EvmWeb3Service.getWeb3(config.ETH_NODE);

export class EthereumProvider {
    static async reverse(): Promise<string[]> {
        const provider = (window as any).ethereum as any;

        if (!provider) {
            throw Error("Provider not found!");
        }
    
        web3.eth.setProvider(provider);
    
        const hash = await provider.request({
            method: "eth_call",
            params: [{
                to: config.CONTRACT_ADDRESS,
                data: keccak256(toUtf8Bytes("reverse()")),
                from: undefined,
                gas: undefined,
                gasPrice: undefined,
            }, "latest"]
        });

        return hash !== "0x" ? this.decrypt(hash) : [];
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
            return provider.request({ method: "eth_decrypt", params: [hash, provider.selectedAddress] });
        } catch (e) {
            return [];
        }
    }
    
    static async sendRegistrationTransfer(domainHash: string, redefinedSign: string, records: AccountRecord[], newRevers: RedefinedRevers) {
        const provider = (window as any).ethereum as any;
    
        if (!provider) {
            throw Error("Provider not found!");
        }
        console.log(domainHash, redefinedSign, records, newRevers);

        try {
            web3.eth.setProvider(provider);
            
            const contract = new web3.eth.Contract(redefinedResolverAbi, config.CONTRACT_ADDRESS);
            
            const equiv = await QuoteService.getEquiv(CryptoCurrency.ETH, FiatCurrency.USD);
            // coast 10$xR
            const payedAmount = exactMath.div(10, equiv);
            const value = exactMath.mul(payedAmount, 10 ** 18);
    
            return await contract.methods.register(domainHash, redefinedSign, records, newRevers).send({
                from: records[0].addr,
                to: config.CONTRACT_ADDRESS,
                gas: 32508,
                gasPrice: 30000,
                value,
            });
        } catch (e: any) {
            throw Error(`Cant create transfer to register domain ${e.message}`);
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
