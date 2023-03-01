import { UnstoppableResolverService } from "@resolver/services/resolvers/unstoppable-resolver.service";
import Resolution from "@unstoppabledomains/resolution";
import config from "@resolver/config";


describe('unstoppable-resolver.service', () => {
    
    const unstoppableResolverService = new UnstoppableResolverService({ eth: config.ETH_NODE, polygon: config.POLYGON_NODE });
    
    const spyIsRegistered = jest.spyOn(Resolution.prototype, 'isRegistered');
    const spyIsAddr = jest.spyOn(Resolution.prototype, 'addr');
    
    beforeEach(() => {
        spyIsRegistered.mockImplementation(async () => true);
        spyIsAddr.mockImplementation(async (domain: string, network: string) => "0x123");
    })

    test('SHOULD get addresses for domain with network IF it is registered and available', async () => {

        expect(await unstoppableResolverService.resolve("ivan.crypto")).toEqual([{ address: "0x123", network: "eth", from: "unstoppable"}])
    });

    test('SHOULD get empty response for domain IF it is not registered', async () => {
        spyIsRegistered.mockReset();
        spyIsRegistered.mockImplementation(async () => false);

        expect(await unstoppableResolverService.resolve("ivan.crypto")).toEqual([]);
    });
});
