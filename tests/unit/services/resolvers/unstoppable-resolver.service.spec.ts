import { UnstoppableResolverService } from "@/services/resolvers/unstoppable-resolver.service";
import { Chain } from "@/models/types";
import Resolution from "@unstoppabledomains/resolution";

describe('unstoppable-resolver.service', () => {
    beforeEach(() => {
        jest.spyOn(Resolution.prototype, 'isRegistered').mockImplementation(async () => true);
        jest.spyOn(Resolution.prototype, 'addr').mockImplementation(async (domain: string, chain: Chain) => "0x123");
    })

    test('SHOULD get addresses for domain with ETH IF it is registered and available', async () => {
        const unstoppableResolverService = new UnstoppableResolverService();

        expect(await unstoppableResolverService.resolve("hui.crypto", Chain.ETH)).toEqual(["0x123"]);
    });
    
    test('SHOULD get addresses for domain with BSC IF it is registered and available', async () => {
        const unstoppableResolverService = new UnstoppableResolverService();
        
        expect(await unstoppableResolverService.resolve("hui.crypto", Chain.BSC)).toEqual(["0x123"]);
    });
    
    test('SHOULD get addresses for domain with ZIL IF it is registered and available', async () => {
        const unstoppableResolverService = new UnstoppableResolverService();
        
        expect(await unstoppableResolverService.resolve("hui.crypto", Chain.ZIL)).toEqual(["0x123"]);
    });

    test('SHOULD get empty response for unsupported chains', async () => {
        const unstoppableResolverService = new UnstoppableResolverService();

        const chains = [Chain.SOL];
        const callTest = async (chain: Chain) => {
            expect(await unstoppableResolverService.resolve("hui.crypto", chain)).toEqual([]);
        };

        await Promise.all(chains.map(callTest));
    });

    test('SHOULD get empty response for domain IF it is not registered', async () => {
        const unstoppableResolverService = new UnstoppableResolverService();
        jest.spyOn(Resolution.prototype, 'isRegistered').mockImplementation(async () => false);

        expect(await unstoppableResolverService.resolve("hui.crypto", Chain.ETH)).toEqual([]);
    });
});
