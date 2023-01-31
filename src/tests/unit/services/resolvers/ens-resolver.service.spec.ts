import { EnsResolverService } from "@/services/resolvers/ens-resolver.service";
import { Chain } from "@/models/types";

const ensResolverService = new EnsResolverService();

describe('ens-resolver.service', () => {

    test('SHOULD get addresses for domain', async () => {
        expect(await ensResolverService.resolve('hui.eth', Chain.ETH)).toEqual(["0x123"]);
    });
});
