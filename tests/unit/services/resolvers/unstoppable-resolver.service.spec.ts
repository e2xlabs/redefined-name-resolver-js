import { UnstoppableResolverService } from "@resolver/services/resolvers/unstoppable-resolver.service";
import type { Network } from "@resolver/models/types";
import Resolution from "@unstoppabledomains/resolution";
import config from "@resolver/config";

describe('unstoppable-resolver.service', () => {
    beforeEach(() => {
        jest.spyOn(Resolution.prototype, 'isRegistered').mockImplementation(async () => true);
        jest.spyOn(Resolution.prototype, 'addr').mockImplementation(async (domain: string, network: string) => "0x123");
    })

    test('SHOULD get addresses for domain with network IF it is registered and available', async () => {

        const networks: Network[] = ["eth", "bsc", "zil"];
        const callTest = async (network: Network) => {
            const unstoppableResolverService = new UnstoppableResolverService(config.ETH_NODE, network);
            expect(await unstoppableResolverService.resolve("cifrex.crypto")).toEqual([{ address: "0x123", network, from: "unstoppable"}]);
        };

        await Promise.all(networks.map(callTest));
    });

    test('SHOULD get empty response for domain IF it is not registered', async () => {
        const unstoppableResolverService = new UnstoppableResolverService(config.ETH_NODE, "eth");
        
        jest.spyOn(Resolution.prototype, 'isRegistered').mockImplementation(async () => false);

        expect(await unstoppableResolverService.resolve("cifrex.crypto")).toEqual([]);
    });
});
