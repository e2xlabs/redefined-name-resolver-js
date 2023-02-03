import config from "@resolver/config";
import { toUtf8Bytes, keccak256 } from "ethers";

export class EthereumProvider {
    static async reverse(): Promise<string[]> {
        const provider = (window as any).ethereum as any;

        if (!provider) {
            throw Error("Provider not found!");
        }
    
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

    private static async encrypt(data: string): Promise<string> {
        const provider = (window as any).ethereumDefi as any;
    
        if (!provider) {
            throw Error("Provider not found!");
        }
        
        try {
            const encryptionPublicKey = await provider.request({ method: "eth_getEncryptionPublicKey", params: [provider.selectedAddress] });
            console.log(encryptionPublicKey);
        } catch (e) {
            throw Error("Cant get encrypted key!");
        }
        return "encrypted.mac";
    }
    
    private static async decrypt(hash: string): Promise<string[]> {
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
}
