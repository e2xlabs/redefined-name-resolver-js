import config from "@resolver/config";
import { RedefinedUsernameResolverService } from "@resolver/services/resolvers/redefined-username-resolver.service";
import { AccountRecord } from "@resolver/models/types";

describe('redefined-username-username-resolver.service', () => {
    const redefinedUsernameResolverService = new RedefinedUsernameResolverService(config.REDEFINED_NODE, true);

    const spyResolveDomain = jest.spyOn(redefinedUsernameResolverService, "resolveDomain");

    function mockImplementationResolveDomain(cb: () => Promise<AccountRecord[]>) {
        spyResolveDomain.mockReset();
        spyResolveDomain.mockImplementation(cb)
    }

    function getErrorFn(msg:string) {
        return () => {
            throw Error(msg)
        }
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
            { address: "0x123", network: "eth", from: "redefined-username", },
            { address: "0x323", network: "sol", from: "redefined-username", },
            { address: "0x323", network: "evm", from: "redefined-username", },
        ]);
    });

    test('SHOULD get addresses IF domain resolved with target networks', async () => {
        expect(await redefinedUsernameResolverService.resolve("cifrex.eth", undefined, ["eth"])).toEqual([
            { address: "0x123", network: "eth", from: "redefined-username", },
        ]);
    });


    test('SHOULD throw Error IF option throwErrorOnInvalidDomain is truthy', async () => {
        mockImplementationResolveDomain(getErrorFn("Domain unexpected error!"));
        let error = "";
        try {
            await redefinedUsernameResolverService.resolve("theseif.eth", { throwErrorOnInvalidDomain: true });
        } catch (e: any) {
            error = e.message;
        }
        expect(error).toBe("redefined Error: Domain unexpected error!")
    });

    test('SHOULD NOT throw Error IF option provided and domain has Invalid character', async () => {
        mockImplementationResolveDomain(getErrorFn("Invalid character"));
        const response = await redefinedUsernameResolverService.resolve("theseif.eth", { throwErrorOnInvalidDomain: false });
        expect(response).toEqual([]);
    });

    test('SHOULD NOT throw Error IF option provided and domain is not registered', async () => {
        mockImplementationResolveDomain(getErrorFn("Name is not registered ivan.eth"));
        const response = await redefinedUsernameResolverService.resolve("theseif.eth", { throwErrorOnInvalidDomain: false });
        expect(response).toEqual([]);
    });

    test('SHOULD NOT throw Error IF option provided and domain has Invalid character', async () => {
        mockImplementationResolveDomain(getErrorFn("Invalid character"));
        const response = await redefinedUsernameResolverService.resolve("theseif.eth", { throwErrorOnInvalidDomain: false });
        expect(response).toEqual([]);
    });

    test('SHOULD NOT throw Error IF option provided and domain should be at sth', async () => {
        mockImplementationResolveDomain(getErrorFn("Name should be at"));
        const response = await redefinedUsernameResolverService.resolve("theseif.eth", { throwErrorOnInvalidDomain: false });
        expect(response).toEqual([]);
    });
});
