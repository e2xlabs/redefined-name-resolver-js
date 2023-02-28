import type { Network } from "@resolver/models/types";
import config from "@resolver/config";
import { RedefinedEmailResolverService } from "@resolver/services/resolvers/redefined-email-resolver.service";

describe('redefined-email-resolver.service', () => {
    test('SHOULD get addresses for domain with network IF networks supported', async () => {
        const networks: Network[] = ["sol", "zil", "bsc"];
        const callTest = async (network: Network) => {
            const redefinedResolverService = new RedefinedEmailResolverService(config.ETH_NODE, network, true);

            expect(await redefinedResolverService.resolve("cifrex.eth", )).toEqual([
                { address: "0x123", network: "eth", from: "redefined", },
                { address: "0x323", network: "sol", from: "redefined", }
            ]);
        };

        await Promise.all(networks.map((it) => callTest(it)));
    });
});
