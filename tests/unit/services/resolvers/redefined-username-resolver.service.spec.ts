import config from "@resolver/config";
import { RedefinedUsernameResolverService } from "@resolver/services/resolvers/redefined-username-resolver.service";

describe('redefined-username-resolver.service', () => {
    const redefinedUsernameResolverService = new RedefinedUsernameResolverService(config.REDEFINED_NODE, true);

    const spyResolveDomain = jest.spyOn(redefinedUsernameResolverService, "resolveDomain");

    function spyOnThrowInvalidDomainError() {
        spyResolveDomain.mockReset();
        spyResolveDomain.mockImplementation(() => {
            throw Error("Invalid character")
        })
    }

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
            { address: "0x123", network: "eth", from: "redefined", },
            { address: "0x323", network: "sol", from: "redefined", },
            { address: "0x323", network: "evm", from: "redefined", },
        ]);
    });
    
    test('SHOULD get addresses IF domain resolved with target networks', async () => {
        expect(await redefinedUsernameResolverService.resolve("cifrex.eth", undefined, ["eth"])).toEqual([
            { address: "0x123", network: "eth", from: "redefined", },
        ]);
    });

    test('SHOULD NOT throw Error IF domain is invalid', async () => {
        spyOnThrowInvalidDomainError();

        const response = await redefinedUsernameResolverService.resolve("theseif.eth", { throwErrorOnInvalidDomain: false });
        expect(response).toEqual([]);
    });

    test('SHOULD throw Error IF domain is invalid', async () => {
        spyOnThrowInvalidDomainError();

        let error = "";
        try {
            await redefinedUsernameResolverService.resolve("theseif.eth", { throwErrorOnInvalidDomain: true });
        } catch (e: any) {
            error = e.message;
        }
        expect(error).toBe("redefined Error: Invalid character")
    });
});
