import { EnsResolverService } from "@resolver/services/resolvers/ens-resolver.service";
import config from "@resolver/config";
import { ethers } from "ethers";


describe('ens-resolver.service', () => {
    const ensResolverService = new EnsResolverService(config.ENS_NODE);

    const spyEthersGetAddress = jest.spyOn(ethers.providers.Resolver.prototype, "getAddress");

    const spyGetResolver = jest.spyOn(ethers.providers.JsonRpcProvider.prototype, "getResolver")

    beforeEach(() => {
        spyGetResolver.mockReset();
        spyEthersGetAddress.mockReset();
        spyEthersGetAddress.mockImplementation(async () => "0x123")
    })

    test('SHOULD get addresses for domain with network IF is valid', async () => {
        expect(await ensResolverService.resolve("theseif.eth")).toEqual([{ address: "0x123", network: "evm", from: "ens", }]);
    });
});
