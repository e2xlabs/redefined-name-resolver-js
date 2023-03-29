import config from "@resolver/config";
import { SidResolverService } from "@resolver/services/resolvers/sid-resolver.service";
import { SidChainId, SidResolverData } from "@resolver/models/types";
import { sidGetAddress } from "../../../moks/siddomains";

describe('sid-resolver.service', () => {
    const sidBscResolverService = new SidResolverService(config.SID_BSC_NODE, SidChainId.BSC, "bsc");
    const sidArbOneResolverService = new SidResolverService(config.SID_ARB_ONE_NODE, SidChainId.ARB, "arbitrum-one", SidResolverData.ARB1);
    const sidArbNovaResolverService = new SidResolverService(config.SID_ARB_ONE_NODE, SidChainId.ARB, "arbitrum-nova", SidResolverData.ARB_NOVA);

    beforeEach(() => {
        sidGetAddress.mockReturnValue("0x123")
    });

    test('SHOULD get bsc addresses for domain with network IF is valid', async () => {
        expect(await sidBscResolverService.resolve("ivan.bnb")).toEqual([{ address: "0x123", network: "bsc", from: "sid", }]);
    });

    test('SHOULD get arbitrum-one addresses for domain with network IF is valid', async () => {
        expect(await sidArbOneResolverService.resolve("nick.arb")).toEqual([{ address: "0x123", network: "arbitrum-one", from: "sid", }]);
    });

    test('SHOULD get arbitrum-nova addresses for domain with network IF is valid', async () => {
        expect(await sidArbNovaResolverService.resolve("nick.arb")).toEqual([{ address: "0x123", network: "arbitrum-nova", from: "sid", }]);
    });

    test('SHOULD get error IF domain is not registered', async () => {
        sidGetAddress.mockReturnValue("0x0000000000000000000000000000000000000000");

        expect(sidBscResolverService.resolve("ivan.bnb")).rejects.toThrow("SID Error: Domain ivan.bnb is not registered");
    });

    test('SHOULD get error IF getAddress failed', async () => {
        sidGetAddress.mockImplementation(()=> { 
            throw new Error("Invalid name")
        });

        expect(sidBscResolverService.resolve("ivan_+!@dasd")).rejects.toThrow("SID Error: Invalid name");
    });
});
