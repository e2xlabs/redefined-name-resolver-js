import { BonfidaResolverService } from "@resolver/services/resolvers/bonfida-resolver.service";
import SolWeb3Service from "@resolver/services/web3/sol-web3.service";
import { Cluster, Connection, PublicKey } from "@solana/web3.js";
import { getDomainKeySync, NameRegistryState } from "@bonfida/spl-name-service";

jest.mock("@bonfida/spl-name-service");
const mockedGetDomainKey = jest.mocked(getDomainKeySync);
mockedGetDomainKey.mockReturnValue({
    isSub: false,
    pubkey: new PublicKey("4DbiZPib1MvFZAecn8rQZtfVHiVQLFGwFTk2ZUawyG2i"),
    parent: new PublicKey("4DbiZPib1MvFZAecn8rQZtfVHiVQLFGwFTk2ZUawyG2i"),
    hashed: new Buffer("123")
});

jest.spyOn(SolWeb3Service, "getWeb3").mockImplementation((cluster: Cluster) => {
    return {} as Connection
})

describe('bonfida-resolver.service', () => {
    const bonfidaResolverService = new BonfidaResolverService();

    const spyRetrieve = jest.spyOn(NameRegistryState, 'retrieve');

    beforeEach(() => {
        spyRetrieve.mockReset();
    })

    test('SHOULD get addresses for domain with network IF is valid', async () => {
        spyRetrieve.mockImplementation(async (connection: Connection, pubKey: PublicKey) => ({
            registry: {
                owner: new PublicKey("4DbiZPib1MvFZAecn8rQZtfVHiVQLFGwFTk2ZUawyG2i")
            } as NameRegistryState,
            nftOwner: undefined
        }));

        expect(await bonfidaResolverService.resolve("beautiful-domain")).toEqual([{
            address: "4DbiZPib1MvFZAecn8rQZtfVHiVQLFGwFTk2ZUawyG2i",
            network: "sol",
            from: "bonfida"
        }]);
    });

    test('SHOULD do not get addresses for domain with network IF is invalid', async () => {
        spyRetrieve.mockRejectedValue(new Error("Invalid name account provided"));

        try {
            await bonfidaResolverService.resolve("beautiful-domain");
        } catch (err: any) {
            expect(err.message).toBe("Bonfida Error: Invalid name account provided");
        }
    });
});