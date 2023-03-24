import config from "@resolver/config";
import { RedefinedUsernameResolverService } from "@resolver/services/resolvers/redefined-username-resolver.service";

describe('redefined-username-resolver.service', () => {
    const redefinedUsernameResolverService = new RedefinedUsernameResolverService(config.REDEFINED_NODE, true);

    const spyResolveDomain = jest.spyOn(redefinedUsernameResolverService, "resolveDomain");
    
    function mockResolve(cb: () => any) {
        spyResolveDomain.mockReset();
        spyResolveDomain.mockImplementation(async () => cb())
    }
    
    beforeEach(() => {
        mockResolve(async () => ([
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

    test('SHOULD fix domain username IF provided with "@"', async () => {
        await redefinedUsernameResolverService.resolve("@badass-ivan", ["eth"])
        expect(spyResolveDomain).toHaveBeenCalledWith("badass-ivan");
    });

    test('SHOULD NOT fix domain username IF provided without "@"', async () => {
        await redefinedUsernameResolverService.resolve("badass-ivan", ["eth"])
        expect(spyResolveDomain).toHaveBeenCalledWith("badass-ivan");
    });
    
    test('SHOULD get error IF no records found for domain', async () => {
        mockResolve(() => []);
        let err = "";
        try {
            await redefinedUsernameResolverService.resolve("@badass-ivan", ["eth"])
        } catch (e: any) {
            err = e.message;
        }
        expect(err).toBe("redefined Error: No records found for domain @badass-ivan");
    });
});
