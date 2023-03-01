import { EnsResolverService } from "@resolver/services/resolvers/ens-resolver.service";
import type { Network } from "@resolver/models/types";
import config from "@resolver/config";


describe('ens-resolver.service', () => {

    test('SHOULD get addresses for domain with network IF networks supported', async () => {

        const networks: Network[] = ["eth", "bsc"];
        const callTest = async (network: Network) => {
            const ensResolverService = new EnsResolverService(config.ETH_NODE, network);
            expect(await ensResolverService.resolve("ivan.eth")).toEqual([{ address: "0x123", network, from: "ens", }]);
        };

        await Promise.all(networks.map((it) => callTest(it)));
    });
});
