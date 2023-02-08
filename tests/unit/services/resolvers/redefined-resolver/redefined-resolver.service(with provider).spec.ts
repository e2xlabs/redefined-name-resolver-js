/**
 * @jest-environment jsdom
 */
import type { Network, AccountRecord } from "@resolver/models/types";
import config from "@resolver/config";
import { RedefinedResolverService } from "@resolver/services/resolvers/redefined-resolver.service";

jest.mock("ethers", () => ({
    ethers: {
        BrowserProvider: class BrowserProvider {
            async getSigner() {
                return {};
            }
        },
        Contract: class Contract {
            async resolve(): Promise<AccountRecord[]> {
                return [
                    { addr: "0x123", network: "eth" },
                    { addr: "0x323", network: "sol" }
                ]
            }
        }
    }
}));

const redefinedResolverService = new RedefinedResolverService();

describe('redefined-resolver.service with provider', () => {
    
    beforeAll(() => {
        // @ts-ignore
        jest.spyOn(window, "window", "get").mockImplementation(() => ({ ethereum: {} }));
    })

    test('SHOULD get addresses for domain with network IF networks supported', async () => {

        const networks: Network[] = ["eth"];
        const callTest = async (network: Network) => {
            expect(await redefinedResolverService.resolve("cifrex.eth", network, config.ETH_NODE)).toEqual([
                { address: "0x123", network: "eth", from: "redefined", },
                { address: "0x323", network: "sol", from: "redefined", }
            ]);
        };

        await Promise.all(networks.map((it) => callTest(it)));
    });

    test('SHOULD get empty response IF networks redefined', async () => {
        const networks: Network[] = ["sol", "zil", "bsc"];
        const callTest = async (network: Network) => {
            expect(await redefinedResolverService.resolve("cifrex.eth", network, config.ETH_NODE)).toEqual([]);
        };

        await Promise.all(networks.map((it) => callTest(it)));
    });
});
