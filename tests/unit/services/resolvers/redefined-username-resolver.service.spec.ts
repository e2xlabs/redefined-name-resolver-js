import config from "@resolver/config";
import { RedefinedUsernameResolverService } from "@resolver/services/resolvers/redefined-username-resolver.service";

describe('redefined-username-username-resolver.service', () => {
    const redefinedUsernameResolverService = new RedefinedUsernameResolverService(config.REDEFINED_NODE, true);

    const spyResolveDomain = jest.spyOn(redefinedUsernameResolverService, "resolveDomain");

    beforeEach(() => {
        spyResolveDomain.mockReset();
        spyResolveDomain.mockImplementation(async () => ([
            { addr: "0x123", network: "eth" },
            { addr: "0x323", network: "sol" },
            { addr: "0x323", network: "evm" },
        ]))
    })

    test('SHOULD get addresses IF domain resolved without target networks', async () => {
        expect(await redefinedUsernameResolverService.resolve("cifrex.eth")).toEqual([
            { address: "0x123", network: "eth", from: "redefined-username", },
            { address: "0x323", network: "sol", from: "redefined-username", },
            { address: "0x323", network: "evm", from: "redefined-username", },
        ]);
    });

    test('SHOULD get addresses IF domain resolved with target networks', async () => {
        expect(await redefinedUsernameResolverService.resolve("cifrex.eth", ["eth"])).toEqual([
            { address: "0x123", network: "eth", from: "redefined-username", },
        ]);
    });
});
