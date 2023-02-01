import { EnsResolverService } from "@/services/resolvers/ens-resolver.service";
import { Chain } from "@/models/types";

const ensResolverService = new EnsResolverService();

describe('ens-resolver.service', () => {

    test('SHOULD get addresses for domain with ETH', async () => {
        expect(await ensResolverService.resolve('hui.eth', Chain.ETH)).toEqual(["0x123"]);
    });
    
    test('SHOULD get addresses for domain BSC', async () => {
        expect(await ensResolverService.resolve('hui.eth', Chain.BSC)).toEqual(["0x123"]);
    });
    
    test('SHOULD get empty response for unsupported chains', async () => {
        const chains = [Chain.SOL, Chain.ZIL];
        const callTest = async (chain: Chain) => {
            expect(await ensResolverService.resolve("hui.crypto", chain)).toEqual([]);
        };
        
        await Promise.all(chains.map(callTest));
    });
});
