import { EnsResolverService } from "@resolver/services/resolvers/ens-resolver.service";
import { UnstoppableResolverService } from "@resolver/services/resolvers/unstoppable-resolver.service";
import { RedefinedUsernameResolverService } from "@resolver/services/resolvers/redefined-username-resolver.service";
import { RedefinedEmailResolverService } from "@resolver/services/resolvers/redefined-email-resolver.service";
import { RedefinedResolver } from "@resolver/redefined.resolver";
import config from "@resolver/config";
import { CustomResolver } from "../test-fixtures/custom-resolver";

describe('redefined.resolver', () => {
  const spyRedefinedUsernameResolve = jest.spyOn(RedefinedUsernameResolverService.prototype, 'resolveDomain');
  const spyRedefinedEmailResolve = jest.spyOn(RedefinedEmailResolverService.prototype, 'resolveDomain');
  const spyEnsResolve = jest.spyOn(EnsResolverService.prototype, 'resolve');
  const spyUnsResolve = jest.spyOn(UnstoppableResolverService.prototype, 'resolve');

  function resetRedefinedImplementationWithNetworks(networks: string[]) {
    spyRedefinedUsernameResolve.mockReset()
    spyRedefinedEmailResolve.mockReset()

    spyRedefinedUsernameResolve.mockImplementation(async () => networks.map(network => ({ addr: "0xUsername", network })));
    spyRedefinedEmailResolve.mockImplementation(async () => networks.map(network => ({ addr: "0xEmail", network })));
  }

  beforeEach(() => {
    spyRedefinedUsernameResolve.mockReset();
    spyRedefinedEmailResolve.mockReset();
    spyEnsResolve.mockReset();
    spyUnsResolve.mockReset();

    spyRedefinedUsernameResolve.mockImplementation(async () => [{ addr: "0xUsername", network: "eth" }]);
    spyRedefinedEmailResolve.mockImplementation(async () => [{ addr: "0xEmail", network: "eth" }]);
    spyEnsResolve.mockImplementation(async () => [{ address: "0x123", network: "eth", from: "ens" }]);
    spyUnsResolve.mockImplementation(async () => [{ address: "0x123", network: "eth", from: "unstoppable" }]);
  })

  test('SHOULD use provided resolvers IF exists', async () => {
    const resolver = new RedefinedResolver({
      resolverNames: ["redefined"]
    })
    // to bypass privacy
    expect(resolver["resolverNames"]).toEqual(["redefined"]);
  });

  test('SHOULD show error on create instance IF resolvers exists but provided nothing', async () => {
    try {
      new RedefinedResolver({ resolverNames: [] })
    } catch (e: any) {
      expect(e.message).toBe("“resolverServices” option must be a non-empty array or falsy")
    }
  });

  test('SHOULD call resolvers IF provided', async () => {
    const resolver = new RedefinedResolver({
      resolverNames: ["redefined", "ens"]
    })

    await resolver.resolve("cifrex.evm", ["eth"]);

    expect(spyRedefinedEmailResolve).toHaveBeenCalled()
    expect(spyRedefinedUsernameResolve).toHaveBeenCalled()
    expect(spyEnsResolve).toHaveBeenCalled()
    expect(spyUnsResolve).not.toHaveBeenCalled()
  });

  test('SHOULD call all resolvers IF none are provided', async () => {
    const resolver = new RedefinedResolver();

    await resolver.resolve("cifrex.evm", ["eth"]);

    expect(spyRedefinedEmailResolve).toHaveBeenCalled()
    expect(spyRedefinedUsernameResolve).toHaveBeenCalled()
    expect(spyEnsResolve).toHaveBeenCalled()
    expect(spyUnsResolve).toHaveBeenCalled()
  });

  test('SHOULD use preinstalled nodes IF none are provided', async () => {
    const resolver = new RedefinedResolver();
    expect(resolver["nodes"]).toEqual({
      arbitrum: config.ARBITRUM_NODE,
      eth: config.ETH_NODE,
      polygon: config.POLYGON_NODE,
    })
  });

  test('SHOULD use nodes IF provided', async () => {
    const resolver = new RedefinedResolver({
      nodes: { eth: "eth_node" }
    });

    expect(resolver["nodes"]).toEqual({
      arbitrum: config.ARBITRUM_NODE,
      eth: "eth_node",
      polygon: config.POLYGON_NODE,
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
    const networks= ["eth", "sol", "zil", "bsc"];

    const resolver = new RedefinedResolver({
      resolverNames: ["redefined"]
    });

    resetRedefinedImplementationWithNetworks(networks)

    const callTest = async (network: string) => {
      expect(await resolver.resolve("cifrex.eth", [network])).toEqual([
        { address: "0xUsername", network, from: "redefined" },
        { address: "0xEmail", network, from: "redefined" },
      ]);
    }

    await Promise.all(networks.map((it) => callTest(it)));
  });

  test('SHOULD resolve with evm network IF target network not resolved', async () => {
    const resolver = new RedefinedResolver({
      resolverNames: ["redefined"]
    });

    const networks = ["eth", "evm"];
    resetRedefinedImplementationWithNetworks(networks)

    expect(await resolver.resolve("cifrex.eth", ["bsc"])).toEqual([
      { address: "0xUsername", network: "evm", from: "redefined" },
      { address: "0xEmail", network: "evm", from: "redefined" },
    ]);
  });

  test('SHOULD NOT resolve with evm network IF target network resolved', async () => {
    const resolver = new RedefinedResolver({
      resolverNames: ["redefined"]
    });

    const networks = ["eth", "evm"];
    resetRedefinedImplementationWithNetworks(networks)

    expect(await resolver.resolve("cifrex.eth", ["eth"])).toEqual([
      { address: "0xUsername", network: "eth", from: "redefined" },
      { address: "0xEmail", network: "eth", from: "redefined" },
    ]);
  });

  test('SHOULD NOT resolve with evm network IF provided option', async () => {
    const resolver = new RedefinedResolver({
      resolverNames: ["redefined"],
      allowDefaultEvmResolves: false,
    });

    const networks = ["eth", "evm"];
    resetRedefinedImplementationWithNetworks(networks)

    expect(await resolver.resolve("cifrex.eth", ["bsc"])).toEqual([]);
  });

  test('SHOULD show error on create instance IF customResolvers exists but provided nothing', async () => {
    let error = "";
    try {
      new RedefinedResolver({ customResolvers: [] })
    } catch (e: any) {
      error = e.message;
    }
    expect(error).toBe("“customResolvers” option must be a non-empty array or falsy")
  });

  test('SHOULD use custom resolver IF provided', async () => {
    const spyCustomResolve = jest.spyOn(CustomResolver.prototype, 'resolve');

    const resolver = new RedefinedResolver({
      customResolvers: [new CustomResolver()]
    });

    await resolver.resolve("domain");

    expect(spyRedefinedEmailResolve).toHaveBeenCalled()
    expect(spyRedefinedUsernameResolve).toHaveBeenCalled()
    expect(spyEnsResolve).toHaveBeenCalled()
    expect(spyUnsResolve).toHaveBeenCalled()
    expect(spyCustomResolve).toHaveBeenCalled()
  });

  test('SHOULD use custom resolver with selected predefined IF provided', async () => {
    const spyCustomResolve = jest.spyOn(CustomResolver.prototype, 'resolve');

    const resolver = new RedefinedResolver({
      resolverNames: ["ens"],
      customResolvers: [new CustomResolver()]
    });

    await resolver.resolve("domain");

    expect(spyEnsResolve).toHaveBeenCalled()
    expect(spyCustomResolve).toHaveBeenCalled()
  });
});
