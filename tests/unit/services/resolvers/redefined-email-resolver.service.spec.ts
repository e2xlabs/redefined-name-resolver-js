import config from "@resolver/config";
import { RedefinedEmailResolverService } from "@resolver/services/resolvers/redefined-email-resolver.service";

describe('redefined-email-resolver.service', () => {
    test('SHOULD get addresses for domain with network IF networks supported', async () => {
        const networks = ["sol", "zil", "bsc"];
        const callTest = async (network: string) => {
            const redefinedResolverService = new RedefinedEmailResolverService(config.ETH_NODE, true);

            expect(await redefinedResolverService.resolve("cifrex.eth", )).toEqual([
                { address: "0x123", network: "eth", from: "redefined", },
                { address: "0x323", network: "sol", from: "redefined", }
            ]);
        };

        await Promise.all(networks.map((it) => callTest(it)));
    });
});
