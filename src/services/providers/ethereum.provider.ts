import config from "@resolver/config";
import { keccak256, toUtf8Bytes } from "ethers";
// import { encrypt } from "eth-sig-util";

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

    static async encrypt(data: string): Promise<string> {
        const provider = (window as any).ethereumDefi as any;
    
        if (!provider) {
            throw Error("Provider not found!");
        }
        
        try {
            const encryptionPublicKey = await provider.request({ method: "eth_getEncryptionPublicKey", params: [provider.selectedAddress] });
            // return hexlify(
            //     Buffer.from(
            //         JSON.stringify(
            //             encrypt(encryptionPublicKey, { data }, 'x25519-xsalsa20-poly1305')
            //         )
            //     )
            // );
            return "";
        } catch (e) {
            throw Error("Cant get encrypted key!");
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
}
