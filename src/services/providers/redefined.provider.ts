import config from "@resolver/config";
import { RedefinedRevers } from "@resolver/models/types";

export class RedefinedProvider {
    static async reverse(): Promise<RedefinedRevers[]> {
        const provider = (window as any).ethereumDefi as any;
        console.log("---- reverse provider",provider);

        if (provider && !provider.isDefi) {
            (window as any).open(config.WALLET_INSTALL_LINK, '_blank').focus();
        }

        const revers = await provider.request({ method: "reverse" });
        console.log(revers);
        return revers;
    }

    // private static async encrypt(data: string) {
    //     const provider = (window as any).ethereumDefi as any;
    //
    //     if (provider && !provider.isDefi) {
    //         (window as any).open(config.WALLET_INSTALL_LINK, '_blank').focus();
    //     }
    //     const encrypt = await provider.request({ method: "eth_encrypt" });
    //     console.log(encrypt);
    //     return encrypt;
    // }
    //
    // private static async decrypt(data: string) {
    //     const provider = (window as any).ethereumDefi as any;
    //
    //     if (provider && !provider.isDefi) {
    //         (window as any).open(config.WALLET_INSTALL_LINK, '_blank').focus();
    //     }
    //     const decrypt = await provider.request({ method: "eth_decrypt" });
    //     console.log(decrypt);
    //     return decrypt;
    // }
}
