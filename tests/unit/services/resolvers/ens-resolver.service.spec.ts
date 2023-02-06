import { EnsResolverService } from "@resolver/services/resolvers/ens-resolver.service";
import type { Network } from "@resolver/models/types";
import config from "@resolver/config";

const ensResolverService = new EnsResolverService();

describe('ens-resolver.service', () => {

    test('SHOULD get addresses for domain with network IF networks supported', async () => {

        const networks: Network[] = ["eth", "bsc"];
        const callTest = async (network: Network) => {
            expect(await ensResolverService.resolve("ivan.eth", network, config.ETH_NODE)).toEqual([{ address: "0x123", network }]);
        };

        await Promise.all(networks.map((it) => callTest(it)));
    });

    test('SHOULD get empty response IF networks unsupported', async () => {
        const networks: Network[] = ["sol", "zil"];
        const callTest = async (network: Network) => {
            expect(await ensResolverService.resolve("cifrex.eth", network, config.ETH_NODE)).toEqual([]);
        };

        await Promise.all(networks.map((it) => callTest(it)));
    });
});
