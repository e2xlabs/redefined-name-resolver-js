import { UnstoppableResolverService } from "@resolver/services/resolvers/unstoppable-resolver.service";
import Resolution from "@unstoppabledomains/resolution";
import config from "@resolver/config";

describe('unstoppable-resolver.service', () => {

    const unstoppableResolverService = new UnstoppableResolverService({ mainnet: config.UNS_MAINNET_NODE, polygonMainnet: config.UNS_POLYGON_MAINNET_NODE });

    const spyIsRegistered = jest.spyOn(Resolution.prototype, 'isRegistered');
    const spyAddr = jest.spyOn(Resolution.prototype, 'addr');

    beforeEach(() => {
        spyIsRegistered.mockReset();
        spyAddr.mockReset();

        spyIsRegistered.mockImplementation(async () => true);
        spyAddr.mockImplementation(async (domain: string, network: string) => "0x123");
    })

    test('SHOULD get addresses for domain with network IF it is registered and available', async () => {

        expect(await unstoppableResolverService.resolve("ivan.crypto")).toEqual([{ address: "0x123", network: "evm", from: "unstoppable"}])
    });
});
