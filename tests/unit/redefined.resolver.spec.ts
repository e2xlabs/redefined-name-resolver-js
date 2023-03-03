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

  test('SHOULD call resolvers IF provided', async () => {
    const resolver = new RedefinedResolver({
      resolvers: [
        ...RedefinedResolver.createRedefinedResolvers(),
        RedefinedResolver.createEnsResolver(),
      ]
    })

    await resolver.resolve("cifrex.evm", ["eth"]);

    expect(spyRedefinedEmailResolve).toHaveBeenCalled()
    expect(spyRedefinedUsernameResolve).toHaveBeenCalled()
    expect(spyEnsResolve).toHaveBeenCalled()
    expect(spyUnsResolve).not.toHaveBeenCalled()
  });
  
  test('SHOULD throw error on setResolver IF provided nothing', async () => {
    let error = "";
    try {
      new RedefinedResolver({ resolvers: [] })
    } catch (e: any) {
      error = e.message;
    }
    
    expect(error).toBe("“resolvers” option must be a non-empty array or falsy");
  });

  test('SHOULD call all resolvers IF none are provided', async () => {
    const resolver = new RedefinedResolver();

    await resolver.resolve("cifrex.evm", ["eth"]);

    expect(spyRedefinedEmailResolve).toHaveBeenCalled()
    expect(spyRedefinedUsernameResolve).toHaveBeenCalled()
    expect(spyEnsResolve).toHaveBeenCalled()
    expect(spyUnsResolve).toHaveBeenCalled()
  });

  test('SHOULD resolve only with target network IF provided', async () => {
    const networks= ["eth", "sol", "zil", "bsc"];

    const resolver = new RedefinedResolver({
      resolvers: RedefinedResolver.createRedefinedResolvers()
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
      resolvers: RedefinedResolver.createRedefinedResolvers()
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
      resolvers: RedefinedResolver.createRedefinedResolvers()
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
      resolvers: RedefinedResolver.createDefaultResolvers({ allowDefaultEvmResolves: false })
    });

    const networks = ["eth", "evm"];
    resetRedefinedImplementationWithNetworks(networks)

    expect(await resolver.resolve("cifrex.eth", ["bsc"])).toEqual([]);
  });

  test('SHOULD use custom resolver IF provided', async () => {
    const spyCustomResolve = jest.spyOn(CustomResolver.prototype, 'resolve');

    const resolver = new RedefinedResolver({
      resolvers: [
        ...RedefinedResolver.createDefaultResolvers(),
        new CustomResolver()
      ]
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
      resolvers: [
        RedefinedResolver.createEnsResolver(),
        new CustomResolver()
      ]
    });

    await resolver.resolve("domain");
  
    expect(spyRedefinedEmailResolve).not.toHaveBeenCalled()
    expect(spyRedefinedUsernameResolve).not.toHaveBeenCalled()
    expect(spyUnsResolve).not.toHaveBeenCalled()
    expect(spyEnsResolve).toHaveBeenCalled()
    expect(spyCustomResolve).toHaveBeenCalled()
  });

  test('SHOULD use only custom resolver IF options provided', async () => {
    const customResolver = new CustomResolver();
    const spyCustomResolve = jest.spyOn(customResolver, 'resolve');
  
    const resolver = new RedefinedResolver({
      resolvers: [customResolver]
    });
    
    await resolver.resolve("domain");

    expect(spyRedefinedEmailResolve).not.toHaveBeenCalled()
    expect(spyRedefinedUsernameResolve).not.toHaveBeenCalled()
    expect(spyEnsResolve).not.toHaveBeenCalled()
    expect(spyUnsResolve).not.toHaveBeenCalled()
    expect(spyCustomResolve).toHaveBeenCalled()
  });
  
  test('SHOULD call resolve with custom options IF provided', async () => {
    const customResolver = new CustomResolver();
    const spyResolve = jest.spyOn(customResolver, 'resolve');
  
    const resolver = new RedefinedResolver({
      resolvers: [customResolver]
    });
    
    await resolver.resolve("domain", undefined, { customOption: "customOption" });
    
    expect(spyResolve).toHaveBeenLastCalledWith("domain", { throwErrorOnInvalidDomain: false, customOption: "customOption" }, undefined)
  });
});
