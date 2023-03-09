import { EnsResolverService } from "@resolver/services/resolvers/ens-resolver.service";
import config from "@resolver/config";
import { ethers } from "ethers";


describe('ens-resolver.service', () => {
    const ensResolverService = new EnsResolverService(config.ENS_NODE);

    const spyEthersGetAddress = jest.spyOn(ethers.providers.Resolver.prototype, "getAddress");

    const spyGetResolver = jest.spyOn(ethers.providers.JsonRpcProvider.prototype, "getResolver")

    function getErrorFn(msg:string) {
        return () => {
            throw Error(msg)
        }
    }

    function mockImplementationGetAddress(cb: () => Promise<string>) {
        spyEthersGetAddress.mockReset();
        spyEthersGetAddress.mockImplementation(cb)
    }

    beforeEach(() => {
        spyGetResolver.mockReset();
        spyEthersGetAddress.mockReset();
        spyEthersGetAddress.mockImplementation(async () => "0x123")
    })

    test('SHOULD get addresses for domain with network IF is valid', async () => {
        expect(await ensResolverService.resolve("theseif.eth")).toEqual([{ address: "0x123", network: "evm", from: "ens", }]);
    });

    test('SHOULD throw Error IF option throwErrorOnInvalidDomain is truthy', async () => {
        mockImplementationGetAddress(getErrorFn("Domain unexpected error!"));
        let error = "";
        try {
            await ensResolverService.resolve("ivan.eth", { throwErrorOnInvalidDomain: true });
        } catch (e: any) {
            error = e.message;
        }
        expect(error).toBe("ENS Error: Domain unexpected error!")
    });

    test('SHOULD NOT throw Error IF option throwErrorOnInvalidDomain is falsy', async () => {
        mockImplementationGetAddress(getErrorFn("Illegal char TEST"));
        const response = await ensResolverService.resolve("nick.eth", { throwErrorOnInvalidDomain: false });
        expect(response).toEqual([]);
    });

    test('SHOULD throw Error IF no resolver for name', async () => {
        spyGetResolver.mockImplementation(async () => null)
        const response = await ensResolverService.resolve("nick.eth", { throwErrorOnInvalidDomain: false });
        expect(response).toEqual([]);
    });

    test('SHOULD throw Error IF domain is not registered', async () => {
        mockImplementationGetAddress(async () => "");
        const response = await ensResolverService.resolve("nick.eth", { throwErrorOnInvalidDomain: false });
        expect(response).toEqual([]);
    });

    test('SHOULD throw Error IF address is invalid', async () => {
        mockImplementationGetAddress(getErrorFn("invalid address"));
        const response = await ensResolverService.resolve("nick.eth", { throwErrorOnInvalidDomain: false });
        expect(response).toEqual([]);
    });
});
