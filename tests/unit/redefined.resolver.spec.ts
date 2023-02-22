import { EnsResolverService } from "@resolver/services/resolvers/ens-resolver.service";
import { UnstoppableResolverService } from "@resolver/services/resolvers/unstoppable-resolver.service";
import { RedefinedResolverService } from "@resolver/services/resolvers/redefined-resolver.service";
import { RedefinedResolver } from "@resolver/redefined.resolver";
import config from "@resolver/config";
import type { Network } from "@resolver/models/types";

describe('redefined.resolver', () => {
  const spyRedefinedResolve = jest.spyOn(RedefinedResolverService.prototype, 'resolve');
  const spyEncResolve = jest.spyOn(EnsResolverService.prototype, 'resolve');
  const spyUnsResolve = jest.spyOn(UnstoppableResolverService.prototype, 'resolve');

  beforeEach(() => {
    spyRedefinedResolve.mockClear();
    spyEncResolve.mockClear();
    spyUnsResolve.mockClear();

    spyRedefinedResolve.mockImplementation(async () => [{ address: "0x123", network: "eth", from: "redefined" }]);
    spyEncResolve.mockImplementation(async () => [{ address: "0x123", network: "eth", from: "ens" }]);
    spyUnsResolve.mockImplementation(async () => [{ address: "0x123", network: "eth", from: "unstoppable" }]);
  })

  test('SHOULD use provided resolvers IF exists', async () => {
    const resolver = new RedefinedResolver({
      resolverServices: ["redefined"]
    })
    // to bypass privacy
    expect(resolver["resolverServices"]).toEqual(["redefined"]);
  });

  test('SHOULD show error on create instance IF resolvers exists but provided nothing', async () => {
    try {
      new RedefinedResolver({ resolverServices: [] })
    } catch (e: any) {
      expect(e.message).toBe("“resolverServices” option must be a non-empty array or falsy")
    }
  });

  test('SHOULD call resolvers IF provided', async () => {
    const resolver = new RedefinedResolver({
      resolverServices: ["redefined", "ens"]
    })

    await resolver.resolve("cifrex.evm", ["eth"]);

    expect(spyRedefinedResolve).toHaveBeenCalled()
    expect(spyEncResolve).toHaveBeenCalled()
    expect(spyUnsResolve).not.toHaveBeenCalled()
  });

  test('SHOULD call all resolvers IF none are provided', async () => {
    const resolver = new RedefinedResolver();

    await resolver.resolve("cifrex.evm", ["eth"]);

    expect(spyRedefinedResolve).toHaveBeenCalled()
    expect(spyEncResolve).toHaveBeenCalled()
    expect(spyUnsResolve).toHaveBeenCalled()
  });

  test('SHOULD use preinstalled nodes IF none are provided', async () => {
    const resolver = new RedefinedResolver();
    expect(resolver["nodes"]).toEqual({
      arbitrum: config.ARBITRUM_NODE,
      eth: config.ETH_NODE,
      bsc: config.BSC_NODE,
      zil: config.ZIL_NODE,
    })
  });

  test('SHOULD use nodes IF provided', async () => {
    const resolver = new RedefinedResolver({
      nodes: { eth: "eth_node" }
    });

    expect(resolver["nodes"]).toEqual({
      arbitrum: config.ARBITRUM_NODE,
      eth: "eth_node",
      bsc: config.BSC_NODE,
      zil: config.ZIL_NODE,
    });
  });

  test('SHOULD show error on create instance IF nodes exists but provided nothing', async () => {
    try {
      new RedefinedResolver({ nodes: {} })
    } catch (e: any) {
      expect(e.message).toBe("“nodes” option must be a non-empty object or falsy")
    }
  });
  
  test('SHOULD resolve only with target network IF provided', async () => {
    const networks: Network[] = ["eth", "sol", "zil", "bsc", "arbitrum"];
    
    const resolver = new RedefinedResolver({
      resolverServices: ["redefined"]
    });
    
    spyRedefinedResolve.mockReset();
    spyRedefinedResolve.mockImplementation(async () => networks.map(network => ({ address: "0x123", network, from: "redefined" })));
    
    const callTest = async (network: Network) => {
      expect(await resolver.resolve("cifrex.eth", [network])).toEqual([{ address: "0x123", network, from: "redefined" }]);
    }
    
    await Promise.all(networks.map((it) => callTest(it)));
  });
});
