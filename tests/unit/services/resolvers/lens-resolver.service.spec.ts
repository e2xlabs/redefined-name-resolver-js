import { LensResolverService } from "@resolver/services/resolvers/lens-resolver.service";

const mockedFetch = jest.fn();
(global as any).fetch = ()=> ({
    json() {
        return mockedFetch()
    }
})

describe('lens-resolver.service', () => {

    const lensResolverService = new LensResolverService("https://api.lens.dev");

    test('SHOULD get addresses for domain with network IF is valid', async () => {

        mockedFetch.mockReturnValue({
            data: {
                profile: {
                    ownedBy: "0x123"
                }
            }
        })

        expect(await lensResolverService.resolve("aaveaave.lens")).toEqual([{
            address: "0x123",
            network: "evm",
            from: "lens"
        }]);
    });

    test('SHOULD do not get addresses for domain with network IF is not registered', async () => {

        mockedFetch.mockReturnValue({
            data: {
                profile: null
            }
        })

        expect(lensResolverService.resolve("aaveaave.lens")).rejects.toThrow("Lens Error: aaveaave.lens is not registered")
    });

    test('SHOULD do not get addresses for domain with network IF is invalid', async () => {

        mockedFetch.mockReturnValue({
            errors: [
                {
                    message: "xxxx Handle must be xxxx"
                }
            ]
        })

        expect(lensResolverService.resolve("aaveaave.lens")).rejects.toThrow("Lens Error: Incorrect domain")
    });
});
