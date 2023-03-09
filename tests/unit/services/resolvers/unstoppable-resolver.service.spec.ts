import { UnstoppableResolverService } from "@resolver/services/resolvers/unstoppable-resolver.service";
import Resolution from "@unstoppabledomains/resolution";
import config from "@resolver/config";
import { AccountRecord } from "@resolver/models/types";


describe('unstoppable-resolver.service', () => {

    const unstoppableResolverService = new UnstoppableResolverService({ mainnet: config.UNS_MAINNET_NODE, polygonMainnet: config.UNS_POLYGON_MAINNET_NODE });

    const spyIsRegistered = jest.spyOn(Resolution.prototype, 'isRegistered');
    const spyAddr = jest.spyOn(Resolution.prototype, 'addr');

    function mockImplementationAddr(cb: () => Promise<string>) {
        spyAddr.mockReset();
        spyAddr.mockImplementation(cb)
    }

    function getErrorFn(msg:string) {
        return () => {
            throw Error(msg)
        }
    }

    beforeEach(() => {
        spyIsRegistered.mockReset();
        spyAddr.mockReset();

        spyIsRegistered.mockImplementation(async () => true);
        spyAddr.mockImplementation(async (domain: string, network: string) => "0x123");
    })

    test('SHOULD get addresses for domain with network IF it is registered and available', async () => {

        expect(await unstoppableResolverService.resolve("ivan.crypto")).toEqual([{ address: "0x123", network: "evm", from: "unstoppable"}])
    });

    test('SHOULD throw Error IF option throwErrorOnInvalidDomain is truthy', async () => {
        mockImplementationAddr(getErrorFn("Domain unexpected error!"));
        let error = "";
        try {
            await unstoppableResolverService.resolve("theseif.eth", { throwErrorOnInvalidDomain: true });
        } catch (e: any) {
            error = e.message;
        }
        expect(error).toBe("Unstoppable Error: Domain unexpected error!")
    });

    test('SHOULD NOT throw Error IF option provided and domain is invalid', async () => {
        mockImplementationAddr(getErrorFn("Domain is invalid"));
        const response = await unstoppableResolverService.resolve("theseif.eth", { throwErrorOnInvalidDomain: false });
        expect(response).toEqual([]);
    });

    test('SHOULD NOT throw Error IF domain is not registered', async () => {
        spyIsRegistered.mockReset();
        spyIsRegistered.mockImplementation(async () => false);
        const response = await unstoppableResolverService.resolve("ivan.crypto", { throwErrorOnInvalidDomain: false });
        expect(response).toEqual([]);
    });

    test('SHOULD throw Error IF domain is invalid', async () => {
        mockImplementationAddr(getErrorFn("is invalid domain"));
        const response = await unstoppableResolverService.resolve("ivan.crypto", { throwErrorOnInvalidDomain: false });
        expect(response).toEqual([]);
    });

    test('SHOULD throw Error IF domain is not supported', async () => {
        mockImplementationAddr(async () => "");
        const response = await unstoppableResolverService.resolve("ivan.crypto", { throwErrorOnInvalidDomain: false });
        expect(response).toEqual([]);
    });
});
