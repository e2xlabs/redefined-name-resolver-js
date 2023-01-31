import { resolution, UnstoppableResolverService } from "@/services/resolvers/unstoppable-resolver.service";
import { Chain } from "@/models/types";

const unstoppableResolverService = new UnstoppableResolverService();

describe('unstoppable-resolver.service', () => {

    beforeEach(() => {
        resolution.isRegistered = jest.fn(async (domain: string) => true)
        resolution.addr = jest.fn(async (domain: string, chain: Chain) => "0x123")
    })

    test('SHOULD get addresses for domain IF it is registered and available', async () => {
        expect(await unstoppableResolverService.getAddresses("hui.crypto", Chain.ETH)).toEqual(["0x123"]);
    });

    test('SHOULD get empty response for unsupported chains', async () => {
        const chains = [Chain.SOL];
        const callTest = async (chain: Chain) => {
            expect(await unstoppableResolverService.getAddresses("hui.crypto", chain)).toEqual([]);
        };

        await Promise.all(chains.map(callTest));
    });

    test('SHOULD get empty response for domain IF it is not registered', async () => {
        resolution.isRegistered = jest.fn(async (domain: string) => false);

        expect(await unstoppableResolverService.getAddresses("hui.crypto", Chain.ETH)).toEqual([]);
    });
});
