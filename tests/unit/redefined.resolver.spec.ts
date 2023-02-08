import { EnsResolverService } from "@resolver/services/resolvers/ens-resolver.service";
import { UnstoppableResolverService } from "@resolver/services/resolvers/unstoppable-resolver.service";
import { RedefinedResolverService } from "@resolver/services/resolvers/redefined-resolver.service";
import { RedefinedResolver } from "@resolver/redefined.resolver";
import config from "@resolver/config";
import EvmWeb3Service from "@resolver/services/web3/evm-web3.service";
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
    expect(resolver["resolverServices"]).toEqual([RedefinedResolverService.prototype]);
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
      eth: config.ETH_NODE,
      bsc: config.BSC_NODE,
      sol: config.SOL_NODE,
    })
  });

  test('SHOULD use nodes IF provided', async () => {
    const resolver = new RedefinedResolver({
      nodes: { eth: "eth_node" }
    });

    expect(resolver["nodes"]).toEqual({
      eth: "eth_node",
      bsc: config.BSC_NODE,
      sol: config.SOL_NODE,
    });
  });

  test('SHOULD call web3 in resolver with target node IF provided', async () => {
    const spyGetEvmWeb3 = jest.spyOn(EvmWeb3Service, "getWeb3")
    spyEncResolve.mockImplementation(async (domain: string, network?: Network, nodeLink?: string) => {
      EvmWeb3Service.getWeb3(nodeLink!);
      return [];
    });

    const resolver = new RedefinedResolver({
      resolverServices: ["ens"],
      nodes: { eth: "eth_node" }
    });

    await resolver.resolve("cifrex.eth", ["eth"]);

    expect(spyGetEvmWeb3).toHaveBeenCalledWith("eth_node");
  });

  test('SHOULD show error on create instance IF nodes exists but provided nothing', async () => {
    try {
      new RedefinedResolver({ nodes: {} })
    } catch (e: any) {
      expect(e.message).toBe("“nodes” option must be a non-empty array or falsy")
    }
  });
});
