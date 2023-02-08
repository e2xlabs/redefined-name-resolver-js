/**
 * @jest-environment jsdom
 */
import type { AccountRecord } from "@resolver/models/types";
import config from "@resolver/config";
import { RedefinedResolverService } from "@resolver/services/resolvers/redefined-resolver.service";
import { ethers } from "ethers";

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

describe("redefined-resolver.service without provider", () => {
    beforeAll(() => {
        // @ts-ignore
        jest.spyOn(window, "window", "get").mockImplementation(() => ({ ethereum: undefined }));
    })

    test('SHOULD throw Error IF provider not found', async () => {
        const spyBrowserProvider = jest.spyOn(ethers, "BrowserProvider");
        try {
            await redefinedResolverService.resolve("cifrex.eth", "eth", config.ETH_NODE)
        } catch (e: any) {
            expect(e.message).toBe("Provider not found!")
        }
        expect(spyBrowserProvider).not.toHaveBeenCalled();
    });
})
