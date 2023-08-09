import { EnsResolverService } from "@resolver/services/resolvers/ens-resolver.service";
import config from "@resolver/config";
import { ethers } from "ethers";


describe('ens-resolver.service', () => {
    const ensResolverService = new EnsResolverService(config.ENS_NODE);

    const spyEthersGetAddress = jest.spyOn(ethers.providers.Resolver.prototype, "getAddress");

    const spyGetResolver = jest.spyOn(ethers.providers.JsonRpcProvider.prototype, "getResolver")

    const spyLookupAddress = jest.spyOn(ethers.providers.JsonRpcProvider.prototype, "lookupAddress")

    beforeEach(() => {
        spyGetResolver.mockReset();
        spyEthersGetAddress.mockReset();
        spyEthersGetAddress.mockImplementation(async () => "0x123")
        spyLookupAddress.mockImplementation(async () => "ricmoo.eth")
    })

    test('SHOULD get addresses for domain with network IF is valid', async () => {
        expect(await ensResolverService.resolve("theseif.eth")).toEqual([{ address: "0x123", network: "evm", from: "ens", }]);
    });

    test('SHOULD get domain for address with network IF is valid', async () => {
        expect(await ensResolverService.reverse("0x5555763613a12D8F3e73be831DFf8598089d3dCa")).toEqual([{ domain: "ricmoo.eth", network: "evm", from: "ens", }]);
    });
});
