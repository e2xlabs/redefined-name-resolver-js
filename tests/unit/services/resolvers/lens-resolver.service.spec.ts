import { ApolloClient, InMemoryCache, NormalizedCacheObject } from "@apollo/client/core";
import { LensResolverService } from "@resolver/services/resolvers/lens-resolver.service";

describe('lens-resolver.service', () => {

    const apolloClientMock: any = {}

    const lensResolverService = new LensResolverService(apolloClientMock as ApolloClient<NormalizedCacheObject>);

    beforeEach(() => {
        apolloClientMock.query = undefined
    })

    test('SHOULD get addresses for domain with network IF is valid', async () => {

        apolloClientMock.query = ()=> ({
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

   
    test('SHOULD get addresses for domain with network IF is not registered', async () => {

        apolloClientMock.query = ()=> ({
            data: {
                profile: null
            }
        })

        try {
            await lensResolverService.resolve("beautiful-domain");
        } catch (err: any) {
            expect(err.message).toBe("Lens Error: beautiful-domain is not registered");
        }
    });

    test('SHOULD get addresses for domain with network IF is invalid', async () => {

        apolloClientMock.query = ()=> { 
            throw {
                networkError: {
                    result: {
                        errors: [
                            {
                                message: "xxxx Handle must be xxxx"
                            }
                        ]
                    }
                }
            }
        }

        try {
            await lensResolverService.resolve("beautiful-domain");
        } catch (err: any) {
            expect(err.message).toBe("Lens Error: incorrect domain");
        }
    });
});
