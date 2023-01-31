import { resolution, UnstoppableResolverService } from "@/services/resolvers/unstoppable-resolver.service";

const unstoppableResolverService = new UnstoppableResolverService();

resolution.isRegistered = jest.fn(async () => true)
resolution.isAvailable = jest.fn(async () => true)
resolution.resolver = jest.fn(async () => "0x123")

describe('unstoppable-resolver.service', () => {

    test('SHOULD get addresses for domain IF it is registered and available', async () => {
        expect(await unstoppableResolverService.getAddresses('brad.crypto')).toEqual(["0x123"]);
    });

    test('SHOULD get Error for domain IF it is not available', async () => {
        resolution.isAvailable = jest.fn(async () => false);

        try {
            await unstoppableResolverService.getAddresses('brad.crypto')
        } catch (e) {
            expect(e.message).toEqual("brad.crypto not available at Unstoppable.");
        }

    });

    test('SHOULD get Error for domain IF it is not registered', async () => {
        resolution.isRegistered = jest.fn(async () => false);

        try {
            await unstoppableResolverService.getAddresses('brad.crypto')
        } catch (e) {
            expect(e.message).toEqual("brad.crypto not registered at Unstoppable.");
        }

    });
});
