import { UnstoppableResolverService } from "@resolver/services/resolvers/unstoppable-resolver.service";
import Resolution from "@unstoppabledomains/resolution";
import config from "@resolver/config";


describe('unstoppable-resolver.service', () => {

    const unstoppableResolverService = new UnstoppableResolverService({ mainnet: config.UNS_MAINNET_NODE, polygonMainnet: config.UNS_POLYGON_MAINNET_NODE });

    const spyIsRegistered = jest.spyOn(Resolution.prototype, 'isRegistered');
    const spyIsAddr = jest.spyOn(Resolution.prototype, 'addr');

    function spyOnThrowInvalidDomainError() {
        spyIsAddr.mockReset();
        spyIsAddr.mockImplementation(() => {
            throw Error("Domain is invalid")
        })
    }

    beforeEach(() => {
        spyIsRegistered.mockReset();
        spyIsAddr.mockReset();

        spyIsRegistered.mockImplementation(async () => true);
        spyIsAddr.mockImplementation(async (domain: string, network: string) => "0x123");
    })

    test('SHOULD get addresses for domain with network IF it is registered and available', async () => {

        expect(await unstoppableResolverService.resolve("ivan.crypto")).toEqual([{ address: "0x123", network: "evm", from: "unstoppable"}])
    });

    test('SHOULD get empty response for domain IF it is not registered', async () => {
        spyIsRegistered.mockReset();
        spyIsRegistered.mockImplementation(async () => false);

        expect(await unstoppableResolverService.resolve("ivan.crypto")).toEqual([]);
    });

    test('SHOULD NOT throw Error IF domain is invalid', async () => {
        spyOnThrowInvalidDomainError();

        const response = await unstoppableResolverService.resolve("theseif.eth", { throwErrorOnInvalidDomain: false });
        expect(response).toEqual([]);
    });

    test('SHOULD throw Error IF domain is invalid', async () => {
        spyOnThrowInvalidDomainError();

        let error = "";
        try {
            await unstoppableResolverService.resolve("theseif.eth", { throwErrorOnInvalidDomain: true });
        } catch (e: any) {
            error = e.message;
        }
        expect(error).toBe("Unstoppable Error: Domain is invalid")
    });
});
