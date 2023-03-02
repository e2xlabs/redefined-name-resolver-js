import { EnsResolverService } from "@resolver/services/resolvers/ens-resolver.service";
import config from "@resolver/config";
import { ethers } from "ethers";


describe('ens-resolver.service', () => {
    const ensResolverService = new EnsResolverService(config.ETH_NODE);

    const spyEthersGetAddress = jest.spyOn(ethers.providers.Resolver.prototype, "getAddress");

    function spyOnThrowInvalidDomainError() {
        spyEthersGetAddress.mockReset();
        spyEthersGetAddress.mockImplementation(() => {
            throw Error("Illegal char @")
        })
    }

    beforeEach(() => {
        spyEthersGetAddress.mockReset();
        spyEthersGetAddress.mockImplementation(async () => "0x123")
    })

    test('SHOULD get addresses for domain with network IF networks supported', async () => {

        expect(await ensResolverService.resolve("theseif.eth")).toEqual([{ address: "0x123", network: "eth", from: "ens", }]);
    });

    test('SHOULD NOT throw Error IF domain is invalid', async () => {
        spyOnThrowInvalidDomainError();

        const response = await ensResolverService.resolve("theseif.eth", { throwErrorOnInvalidDomain: false });
        expect(response).toEqual([]);
    });

    test('SHOULD throw Error IF domain is invalid', async () => {
        spyOnThrowInvalidDomainError();

        let error = "";
        try {
            await ensResolverService.resolve("theseif.eth", { throwErrorOnInvalidDomain: true });
        } catch (e: any) {
            error = e.message;
        }
        expect(error).toBe("ENS Error: Illegal char @")
    });
});
