import config from "@resolver/config";
import { RedefinedEmailResolverService } from "@resolver/services/resolvers/redefined-email-resolver.service";

describe('redefined-email-resolver.service', () => {
    const redefinedEmailResolverService = new RedefinedEmailResolverService(config.REDEFINED_NODE, true);

    const spyResolveDomain = jest.spyOn(redefinedEmailResolverService, "resolveDomain");

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
            { addr: "0x323", network: "sol" }
        ]))
    })

    test('SHOULD get addresses IF domain resolved', async () => {
        expect(await redefinedEmailResolverService.resolve("cifrex.eth")).toEqual([
            { address: "0x123", network: "eth", from: "redefined", },
            { address: "0x323", network: "sol", from: "redefined", }
        ]);
    });

    test('SHOULD NOT throw Error IF domain is invalid', async () => {
        spyOnThrowInvalidDomainError();

        const response = await redefinedEmailResolverService.resolve("theseif.eth", { throwErrorOnInvalidDomain: false });
        expect(response).toEqual([]);
    });

    test('SHOULD throw Error IF domain is invalid', async () => {
        spyOnThrowInvalidDomainError();

        let error = "";
        try {
            await redefinedEmailResolverService.resolve("theseif.eth", { throwErrorOnInvalidDomain: true });
        } catch (e: any) {
            error = e.message;
        }
        expect(error).toBe("redefined Error: Invalid character")
    });
});
