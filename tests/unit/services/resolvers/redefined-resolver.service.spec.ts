import type { Network } from "@resolver/models/types";
import config from "@resolver/config";
import { RedefinedResolverService } from "@resolver/services/resolvers/redefined-resolver.service";

describe('redefined-resolver.service with provider', () => {
    test('SHOULD get addresses for domain with network IF networks supported', async () => {
        const networks: Network[] = ["sol", "zil", "bsc"];
        const callTest = async (network: Network) => {
            const redefinedResolverService = new RedefinedResolverService(config.ETH_NODE, network);
    
            expect(await redefinedResolverService.resolve("cifrex.eth")).toEqual([
                { address: "0x123", network: "eth", from: "redefined", },
                { address: "0x323", network: "sol", from: "redefined", }
            ]);
        };

        await Promise.all(networks.map((it) => callTest(it)));
    });
});
