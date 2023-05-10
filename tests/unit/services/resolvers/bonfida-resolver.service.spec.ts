import { BonfidaResolverService } from "@resolver/services/resolvers/bonfida-resolver.service";
import SolWeb3Service from "@resolver/services/web3/sol-web3.service";
import { Connection, PublicKey } from "@solana/web3.js";
import { getDomainKeySync, NameRegistryState } from "@bonfida/spl-name-service";
import config from "@resolver/config";

jest.mock("@bonfida/spl-name-service");
const mockedGetDomainKey = jest.mocked(getDomainKeySync);
mockedGetDomainKey.mockReturnValue({
    isSub: false,
    pubkey: new PublicKey("4DbiZPib1MvFZAecn8rQZtfVHiVQLFGwFTk2ZUawyG2i"),
    parent: new PublicKey("4DbiZPib1MvFZAecn8rQZtfVHiVQLFGwFTk2ZUawyG2i"),
    hashed: new Buffer("123")
});

jest.spyOn(SolWeb3Service, "getWeb3").mockImplementation(() => {
    return {} as Connection
})

describe('bonfida-resolver.service', () => {
    const bonfidaResolverService = new BonfidaResolverService(config.SOLANA_NODE);

    const spyRetrieve = jest.spyOn(NameRegistryState, 'retrieve');

    beforeEach(() => {
        spyRetrieve.mockReset();
    })

    test('SHOULD use address for domain from registry.owner IF is valid AND nftOwner is empty', async () => {
        spyRetrieve.mockImplementation(async (connection: Connection, pubKey: PublicKey) => ({
            registry: {
                owner: new PublicKey("4DbiZPib1MvFZAecn8rQZtfVHiVQLFGwFTk2ZUawyG2i")
            } as NameRegistryState,
            nftOwner: undefined
        }));

        expect(await bonfidaResolverService.resolve("nick.sol")).toEqual([{
            address: "4DbiZPib1MvFZAecn8rQZtfVHiVQLFGwFTk2ZUawyG2i",
            network: "sol",
            from: "bonfida"
        }]);
    });
    
    test('SHOULD use address for domain from nftOwner IF is valid AND nftOwner is not empty', async () => {
        spyRetrieve.mockImplementation(async (connection: Connection, pubKey: PublicKey) => ({
            registry: {
                owner: new PublicKey("FcRTh2D4Jip59xMfQxJiE7DAZ1Q1ZPnE39ow9a1cVD8V")
            } as NameRegistryState,
            nftOwner: new PublicKey("BFbCgHxJasyZ4XCYBft7oQqozwGybrgjzVtixdBdds6F")
        }));
        
        expect(await bonfidaResolverService.resolve("tag.sol")).toEqual([{
            address: "BFbCgHxJasyZ4XCYBft7oQqozwGybrgjzVtixdBdds6F",
            network: "sol",
            from: "bonfida"
        }]);
    });

    test('SHOULD do not get addresses for domain with network IF is invalid', async () => {
        spyRetrieve.mockRejectedValue(new Error("Invalid name account provided"));

        expect(bonfidaResolverService.resolve("nick.sol")).rejects.toThrow("Bonfida Error: Invalid name account provided");
    });

    test('SHOULD do not get addresses for domain with network IF domain ends without .sol', async () => {
        expect(bonfidaResolverService.resolve("nick")).rejects.toThrow("Bonfida Error: nick is not supported");
    });
});
