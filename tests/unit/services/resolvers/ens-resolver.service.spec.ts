import { EnsResolverService } from "@/services/resolvers/ens-resolver.service";
import { Network } from "@/models/types";

const ensResolverService = new EnsResolverService();

describe('ens-resolver.service', () => {

    test('SHOULD get addresses for domain with network IF networks supported', async () => {
        
        const networks = ["eth", "bsc"];
        const callTest = async (network: Network) => {
            expect(await ensResolverService.resolve("hui.crypto", network)).toEqual([{ address: "0x123", network, }]);
        };
        
        await Promise.all(networks.map(callTest));
    });
    
    test('SHOULD get empty response IF networks unsupported', async () => {
        const networks = ["sol", "zil"];
        const callTest = async (network: Network) => {
            expect(await ensResolverService.resolve("hui.crypto", network)).toEqual([]);
        };
        
        await Promise.all(networks.map(callTest));
    });
});
