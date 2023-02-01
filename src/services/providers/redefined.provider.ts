import config from "@/config";
import { Revers } from "@/models/types";

export class RedefinedProvider {
    static async reverse(): Promise<Revers[]> {
        const provider = (window as any).ethereumDefi as any;
        console.log(provider);
    
        if (provider && !provider.isDefi) {
            throw Error("No redefined provider!");
        }
    
        try {
            const revers = await provider.request({ method: "reverse" });
            console.log(revers);
            return revers;
        } catch (e) {
            (window as any).open(config.WALLET_INSTALL_LINK, '_blank').focus();
        }
    }
}
