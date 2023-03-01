import { EnsResolverService } from "@resolver/services/resolvers/ens-resolver.service";
import config from "@resolver/config";
import { ethers } from "ethers";


describe('ens-resolver.service', () => {
    const ensResolverService = new EnsResolverService(config.ETH_NODE);
    
    const spyEthersGetAddress = jest.spyOn(ethers.providers.Resolver.prototype, "getAddress");
    
    
    beforeEach(() => {
        spyEthersGetAddress.mockImplementation(async () => "0x123")
    })

    test('SHOULD get addresses for domain with network IF networks supported', async () => {
        
        expect(await ensResolverService.resolve("theseif.eth")).toEqual([{ address: "0x123", network: "eth", from: "ens", }]);
    });
});
