import config from "@/config";
import { ResolvedAddress } from "@/models/types";

export class RedefinedProvider {
    static async reverse(): Promise<ResolvedAddress[]> {
        const provider = (window as any).ethereumDefi as any;
        console.log(provider);
    
        if (provider && !provider.isDefi) {
            throw Error("No redefined provider!");
        }
    
        try {
            const accounts = await provider.request({ method: "reverse" });
            console.log(accounts);
            return accounts;
        } catch (e) {
            (window as any).open(config.WALLET_INSTALL_LINK, '_blank').focus();
        }
    }
}
