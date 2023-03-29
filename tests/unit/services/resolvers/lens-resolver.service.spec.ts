import { LensResolverService } from "@resolver/services/resolvers/lens-resolver.service";
import { lensQuery } from "../../../moks/lens";

describe('lens-resolver.service', () => {

    const lensResolverService = new LensResolverService("fake-url");

    test('SHOULD get addresses for domain with network IF is valid', async () => {

        lensQuery.mockReturnValue({
            data: {
                profile: {
                    ownedBy: "0x123"
                }
            }
        })

        expect(await lensResolverService.resolve("beautiful-domain")).toEqual([{
            address: "0x123",
            network: "evm",
            from: "lens"
        }]);
    });

   
    test('SHOULD do not get addresses for domain with network IF is not registered', async () => {

        lensQuery.mockReturnValue({
            data: {
                profile: null
            }
        })

        expect(lensResolverService.resolve("beautiful-domain")).rejects.toThrow("Lens Error: beautiful-domain is not registered")
    });

    test('SHOULD do not get addresses for domain with network IF is invalid', async () => {

        lensQuery.mockRejectedValue({
            networkError: {
                result: {
                    errors: [
                        {
                            message: "xxxx Handle must be xxxx"
                        }
                    ]
                }
            }
        })

        expect(lensResolverService.resolve("beautiful-domain")).rejects.toThrow("Lens Error: incorrect domain")
    });
});
