import config from "@resolver/config";
import { keccak256, toUtf8Bytes, hexlify } from "ethers";
import { encrypt } from "eth-sig-util";
import EvmWeb3Service from "@resolver/services/web3/evm-web3.service";
import redefinedResolverAbi from "@resolver/services/abis/redefined-resolver.abi";
import type { AccountRecord, RedefinedRevers } from "@resolver/models/types";
import BN from 'bn.js';
import { QuoteService } from "@resolver/services/quote.service";
import { CryptoCurrency, FiatCurrency } from "@resolver/models/types";

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

        try {
            web3.eth.setProvider(provider);
            
            const contract = new web3.eth.Contract(redefinedResolverAbi, config.CONTRACT_ADDRESS);
            
            const equiv = await QuoteService.getEquiv(CryptoCurrency.ETH, FiatCurrency.USD);
            const payedAmount = new BN(10).div(new BN(equiv));
            const decimals = new BN(10).pow(new BN(18));
            // 10$ in GWEI
            const value = payedAmount.mul(decimals).toString();
            console.log(equiv, payedAmount.toString(), value);
            console.log("========== GET",{
                from: records[0].addr,
                to: config.CONTRACT_ADDRESS,
                gas: 32508,
                gasPrice: 10000,
                value,
            });
            
            return await contract.methods.register(domainHash, redefinedSign, records, newRevers).send({
                from: records[0].addr,
                to: config.CONTRACT_ADDRESS,
                gas: 32508,
                gasPrice: await web3.eth.getGasPrice(),
                value,
            });
        } catch (e: any) {
            throw Error(`Cant create transfer to register domain ${e.message}`);
        }
    }
}
