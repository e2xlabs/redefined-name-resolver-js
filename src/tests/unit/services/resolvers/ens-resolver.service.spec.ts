import { EnsResolverService } from "@/services/resolvers/ens-resolver.service";

const ensResolverService = new EnsResolverService();

describe('ens-resolver.service', () => {

    test('SHOULD get addresses for domain', async () => {
        expect(await ensResolverService.getAddresses('hui.eth')).toEqual(["0x123"]);
    });
});
