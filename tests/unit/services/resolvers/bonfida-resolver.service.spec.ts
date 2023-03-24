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

    const spyAddr = jest.spyOn(NameRegistryState, 'retrieve');

    beforeEach(() => {
        spyAddr.mockReset();

        spyAddr.mockImplementation(async (connection: Connection, pubKey: PublicKey) => ({
            registry: {
                owner: new PublicKey("4DbiZPib1MvFZAecn8rQZtfVHiVQLFGwFTk2ZUawyG2i")
            } as NameRegistryState,
            nftOwner: undefined
        }));
    })

    test('SHOULD get addresses for domain with network IF is valid', async () => {
        expect(await bonfidaResolverService.resolve("pizdec")).toEqual([{
            address: "4DbiZPib1MvFZAecn8rQZtfVHiVQLFGwFTk2ZUawyG2i",
            network: "sol",
            from: "bonfida"
        }]);
    });
});
