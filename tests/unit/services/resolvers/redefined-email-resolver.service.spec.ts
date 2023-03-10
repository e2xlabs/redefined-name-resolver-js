import config from "@resolver/config";
import { RedefinedEmailResolverService } from "@resolver/services/resolvers/redefined-email-resolver.service";

describe('redefined-email-resolver.service', () => {
    const redefinedEmailResolverService = new RedefinedEmailResolverService(config.REDEFINED_NODE, true);

    const spyResolveDomain = jest.spyOn(redefinedEmailResolverService, "resolveDomain");

    beforeEach(() => {
        spyResolveDomain.mockReset();
        spyResolveDomain.mockImplementation(async () => ([
            { addr: "0x123", network: "eth" },
            { addr: "0x323", network: "sol" },
            { addr: "0x323", network: "evm" },
        ]))
    })

    test('SHOULD get addresses IF domain resolved without target network', async () => {
        expect(await redefinedEmailResolverService.resolve("cifrex.eth")).toEqual([
            { address: "0x123", network: "eth", from: "redefined-email", },
            { address: "0x323", network: "sol", from: "redefined-email", },
            { address: "0x323", network: "evm", from: "redefined-email", },
        ]);
    });

    test('SHOULD get addresses IF domain resolved with target networks', async () => {
        expect(await redefinedEmailResolverService.resolve("cifrex.eth", ["eth"])).toEqual([
            { address: "0x123", network: "eth", from: "redefined-email", },
        ]);
    });
});
