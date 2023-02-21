import type { Network } from "@resolver/models/types";
import config from "@resolver/config";
import { RedefinedResolverService } from "@resolver/services/resolvers/redefined-resolver.service";

const redefinedResolverService = new RedefinedResolverService();

describe('redefined-resolver.service with provider', () => {
    test('SHOULD get addresses for domain with network IF networks supported', async () => {
        const networks: Network[] = ["sol", "zil", "bsc"];
        const callTest = async (network: Network) => {
            expect(await redefinedResolverService.resolve("cifrex.eth", network, config.ETH_NODE)).toEqual([
                { address: "0x123", network: "eth", from: "redefined", },
                { address: "0x323", network: "sol", from: "redefined", }
            ]);
        };

        await Promise.all(networks.map((it) => callTest(it)));
    });
});
