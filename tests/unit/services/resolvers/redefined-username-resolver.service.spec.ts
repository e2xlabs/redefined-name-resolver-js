import config from "@resolver/config";
import { RedefinedUsernameResolverService } from "@resolver/services/resolvers/redefined-username-resolver.service";
import { BN } from "ethereumjs-util";

describe('redefined-username-resolver.service', () => {
    const redefinedUsernameResolverService = new RedefinedUsernameResolverService(config.REDEFINED_NODE, true);

    const spyResolveDomain = jest.spyOn(redefinedUsernameResolverService, "resolveDomain");
    const spyReverseAddress = jest.spyOn(redefinedUsernameResolverService, "reverseAddress");

    function mockResolve(cb: () => any) {
        spyResolveDomain.mockReset();
        spyReverseAddress.mockReset();

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
        expect(await redefinedUsernameResolverService.resolve("badass-ivan")).toEqual([
            { address: "0x123", network: "eth", from: "redefined-username", },
            { address: "0x323", network: "sol", from: "redefined-username", },
            { address: "0x323", network: "evm", from: "redefined-username", },
        ]);
    });

    test('SHOULD get addresses IF domain resolved with target networks', async () => {
        expect(await redefinedUsernameResolverService.resolve("badass-ivan", ["eth"])).toEqual([
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

    test('SHOULD return domain for address IF it is registered and available', async () => {
        spyReverseAddress.mockImplementation(async () => ([new BN(1000), "[\"example\", \"username\"]"]));

        expect(await redefinedUsernameResolverService.reverse("0xf2C7Fb534Bd93F3d8c65696ABD864f0f086dC704"))
            .toEqual([
                { domain: "example", from: "redefined-username", },
                { domain: "username", from: "redefined-username", },
            ]);
    });

    test('SHOULD NOT return domain for address IF it is NOT registered and available', async () => {
        expect(redefinedUsernameResolverService.reverse("0x6BdfC9Fb0102ddEFc2C7eb44cf62e96356D55d04"))
            .rejects.toThrow("redefined Error: No records found for address 0x6BdfC9Fb0102ddEFc2C7eb44cf62e96356D55d04")
    });

    test('SHOULD throw error IF address is invalid', async () => {
        expect(redefinedUsernameResolverService.reverse("qweEWQ")).rejects.toThrow("redefined Error: Invalid address: qweEWQ")
    });
});
