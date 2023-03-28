// @ts-ignore
import '@siddomains/sidjs';
import { SidChainId } from "@resolver/models/types";

export const sidGetAddress = jest.fn()

jest.mock('@siddomains/sidjs', () => {

    return {
        __esModule: true,
        default: class SID {
            constructor(params: { provider: any, sidAddress: any }) {}

            name(domain: string) {
                return {
                    getAddress: sidGetAddress
                }
            }
        },
        getSidAddress: (chainId: SidChainId) => {
            return ""
        },
    };
});
