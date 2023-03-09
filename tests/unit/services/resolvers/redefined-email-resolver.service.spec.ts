import config from "@resolver/config";
import { RedefinedEmailResolverService } from "@resolver/services/resolvers/redefined-email-resolver.service";
import { AccountRecord } from "@resolver/models/types";

describe('redefined-email-email-resolver.service', () => {
    const redefinedEmailResolverService = new RedefinedEmailResolverService(config.REDEFINED_NODE, true);

    const spyResolveDomain = jest.spyOn(redefinedEmailResolverService, "resolveDomain");

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

    test('SHOULD get addresses IF domain resolved without target network', async () => {
        expect(await redefinedEmailResolverService.resolve("cifrex.eth")).toEqual([
            { address: "0x123", network: "eth", from: "redefined-email", },
            { address: "0x323", network: "sol", from: "redefined-email", },
            { address: "0x323", network: "evm", from: "redefined-email", },
        ]);
    });

    test('SHOULD get addresses IF domain resolved with target networks', async () => {
        expect(await redefinedEmailResolverService.resolve("cifrex.eth", undefined, ["eth"])).toEqual([
            { address: "0x123", network: "eth", from: "redefined-email", },
        ]);
    });

    test('SHOULD throw Error IF option throwErrorOnInvalidDomain is truthy', async () => {
        mockImplementationResolveDomain(getErrorFn("Domain unexpected error!"));
        let error = "";
        try {
            await redefinedEmailResolverService.resolve("theseif.eth", { throwErrorOnInvalidDomain: true });
        } catch (e: any) {
            error = e.message;
        }
        expect(error).toBe("redefined Error: Domain unexpected error!")
    });

    test('SHOULD NOT throw Error IF option provided and domain has Invalid character', async () => {
        mockImplementationResolveDomain(getErrorFn("Invalid character"));
        const response = await redefinedEmailResolverService.resolve("theseif.eth", { throwErrorOnInvalidDomain: false });
        expect(response).toEqual([]);
    });

    test('SHOULD NOT throw Error IF option provided and domain is not registered', async () => {
        mockImplementationResolveDomain(getErrorFn("Name is not registered ivan.eth"));
        const response = await redefinedEmailResolverService.resolve("theseif.eth", { throwErrorOnInvalidDomain: false });
        expect(response).toEqual([]);
    });

    test('SHOULD NOT throw Error IF option provided and domain has Invalid character', async () => {
        mockImplementationResolveDomain(getErrorFn("Invalid character"));
        const response = await redefinedEmailResolverService.resolve("theseif.eth", { throwErrorOnInvalidDomain: false });
        expect(response).toEqual([]);
    });

    test('SHOULD NOT throw Error IF option provided and domain should be at sth', async () => {
        mockImplementationResolveDomain(getErrorFn("Name should be at"));
        const response = await redefinedEmailResolverService.resolve("theseif.eth", { throwErrorOnInvalidDomain: false });
        expect(response).toEqual([]);
    });
});
