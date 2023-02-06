import { UnstoppableResolverService } from "@resolver/services/resolvers/unstoppable-resolver.service";
import type { Network } from "@resolver/models/types";
import Resolution from "@unstoppabledomains/resolution";

describe('unstoppable-resolver.service', () => {
    beforeEach(() => {
        jest.spyOn(Resolution.prototype, 'isRegistered').mockImplementation(async () => true);
        jest.spyOn(Resolution.prototype, 'addr').mockImplementation(async (domain: string, network: string) => "0x123");
    })

    test('SHOULD get addresses for domain with network IF it is registered and available', async () => {
        const unstoppableResolverService = new UnstoppableResolverService();

        const networks: Network[] = ["eth", "bsc", "zil"];
        const callTest = async (network: Network) => {
            expect(await unstoppableResolverService.resolve("cifrex.crypto", network)).toEqual([{ address: "0x123", network, }]);
        };

        await Promise.all(networks.map(callTest));
    });

    test('SHOULD get empty response for unsupported networks', async () => {
        const unstoppableResolverService = new UnstoppableResolverService();

        const networks: Network[] = ["sol"];
        const callTest = async (network: Network) => {
            expect(await unstoppableResolverService.resolve("cifrex.crypto", network)).toEqual([]);
        };

        await Promise.all(networks.map(callTest));
    });

    test('SHOULD get empty response for domain IF it is not registered', async () => {
        const unstoppableResolverService = new UnstoppableResolverService();
        jest.spyOn(Resolution.prototype, 'isRegistered').mockImplementation(async () => false);

        expect(await unstoppableResolverService.resolve("cifrex.crypto", "eth")).toEqual([]);
    });
});
