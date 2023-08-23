import { UnstoppableResolverService } from "@resolver/services/resolvers/unstoppable-resolver.service";
import Resolution from "@unstoppabledomains/resolution";
import config from "@resolver/config";

describe('unstoppable-resolver.service', () => {

    const unstoppableResolverService = new UnstoppableResolverService({
        mainnet: config.UNS_MAINNET_NODE,
        polygonMainnet: config.UNS_POLYGON_MAINNET_NODE
    });

    const spyIsRegistered = jest.spyOn(Resolution.prototype, 'isRegistered');
    const spyAddr = jest.spyOn(Resolution.prototype, 'addr');
    const spyReverse = jest.spyOn(Resolution.prototype, 'reverse');

    beforeEach(() => {
        spyIsRegistered.mockReset();
        spyAddr.mockReset();
        spyReverse.mockReset();

        spyIsRegistered.mockImplementation(async () => true);
        spyAddr.mockImplementation(async (domain: string, network: string) => "0x123");
        spyReverse.mockImplementation(async (address: string) => "jim.crypto");
    })

    test('SHOULD get addresses for domain with network IF it is registered and available', async () => {

        expect(await unstoppableResolverService.resolve("ivan.crypto")).toEqual([{ address: "0x123", network: "evm", from: "unstoppable"}])
    });

    test('SHOULD get domain for address IF it is registered and available', async () => {
        expect(await unstoppableResolverService.reverse("0x88bc9b6c56743a38223335fac05825d9355e9f83")).toEqual([{
            domain: "jim.crypto",
            from: "unstoppable"
        }])
    });

    test('SHOULD throw error IF address is invalid', async () => {
        expect(unstoppableResolverService.reverse("qweEWQ")).rejects.toThrow("Unstoppable Error: Invalid address: qweEWQ")
    });
});
