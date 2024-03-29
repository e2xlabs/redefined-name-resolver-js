import { EnsResolverService } from "@resolver/services/resolvers/ens-resolver.service";
import { UnstoppableResolverService } from "@resolver/services/resolvers/unstoppable-resolver.service";
import { RedefinedUsernameResolverService } from "@resolver/services/resolvers/redefined-username-resolver.service";
import { RedefinedEmailResolverService } from "@resolver/services/resolvers/redefined-email-resolver.service";
import { RedefinedResolver } from "@resolver/redefined.resolver";
import { CustomResolver } from "../test-fixtures/custom-resolver";
import { SidResolverService } from "@resolver/services/resolvers/sid-resolver.service";
import { BonfidaResolverService } from "@resolver/services/resolvers/bonfida-resolver.service";
import * as fs from "fs";
import { LensResolverService } from "@resolver/services/resolvers/lens-resolver.service";
import { BulkProxy } from "@resolver/services/proxies/bulk-resolver.service";
import { mockConfigResolvers } from "../test-fixtures/config-resolvers-response";
import config from "@resolver/config";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(mockConfigResolvers),
  }),
) as jest.Mock;

describe('redefined.resolver', () => {
  const spyRedefinedUsernameResolve = jest.spyOn(RedefinedUsernameResolverService.prototype, 'resolveDomain');
  const spyRedefinedEmailResolve = jest.spyOn(RedefinedEmailResolverService.prototype, 'resolveDomain');
  const spyEnsResolve = jest.spyOn(EnsResolverService.prototype, 'resolve');
  const spyUnsResolve = jest.spyOn(UnstoppableResolverService.prototype, 'resolve');
  const spySidResolve = jest.spyOn(SidResolverService.prototype, 'resolve');
  const spySolResolve = jest.spyOn(BonfidaResolverService.prototype, 'resolve');
  const spyLensResolve = jest.spyOn(LensResolverService.prototype, 'resolve');
  const spyUnsReverse = jest.spyOn(UnstoppableResolverService.prototype, 'reverse');
  const spySolReverse = jest.spyOn(BonfidaResolverService.prototype, 'reverse');
  const spyEnsReverse = jest.spyOn(EnsResolverService.prototype, 'reverse');
  const spyLensReverse = jest.spyOn(LensResolverService.prototype, 'reverse');
  const spySidReverse = jest.spyOn(SidResolverService.prototype, 'reverse');

  function resetRedefinedImplementationWithNetworks(networks: string[]) {
    spyRedefinedUsernameResolve.mockReset()
    spyRedefinedEmailResolve.mockReset()

    spyRedefinedUsernameResolve.mockImplementation(async () => networks.map(network => ({
      addr: "0xUsername",
      network
    })));
    spyRedefinedEmailResolve.mockImplementation(async () => networks.map(network => ({ addr: "0xEmail", network })));
  }

  beforeEach(() => {
    spyRedefinedUsernameResolve.mockReset();
    spyRedefinedEmailResolve.mockReset();
    spyEnsResolve.mockReset();
    spyUnsResolve.mockReset();
    spySidResolve.mockReset();
    spySolResolve.mockReset();
    spyLensResolve.mockReset();
    spyEnsReverse.mockReset();
    spyUnsReverse.mockReset();
    spySolReverse.mockReset();
    spyLensReverse.mockReset();
    spySidReverse.mockReset();

    spyRedefinedUsernameResolve.mockImplementation(async () => [{ addr: "0xUsername", network: "eth" }]);
    spyRedefinedEmailResolve.mockImplementation(async () => [{ addr: "0xEmail", network: "eth" }]);
    spyEnsResolve.mockImplementation(async () => [{ address: "0x123", network: "eth", from: "ens" }]);
    spyUnsResolve.mockImplementation(async () => [{ address: "0x123", network: "eth", from: "unstoppable" }]);
    spySidResolve.mockImplementation(async () => [{ address: "0x123", network: "bsc", from: "sid" }]);
    spySolResolve.mockImplementation(async () => [{ address: "4DbiZPib1MvF", network: "sol", from: "bonfida" }]);
    spyLensResolve.mockImplementation(async () => [{ address: "0x123", network: "evm", from: "lens" }]);
    spyEnsReverse.mockImplementation(async () => [{ domain: "nick.eth", from: "ens" }]);
    spyUnsReverse.mockImplementation(async () => [{ domain: "example.crypto", from: "unstoppable" }]);
    spySolReverse.mockImplementation(async () => [{ domain: "666.sol", from: "bonfida" }]);
    spyLensReverse.mockImplementation(async () => [{ domain: "aaa.lens", from: "lens" }]);
    spySidReverse.mockImplementation(async () => [{ domain: "bbb.bsc", from: "sid" }]);
  })

  test('SHOULD call resolvers IF provided', async () => {
    const resolver = new RedefinedResolver({
      resolvers: [
        RedefinedResolver.createRedefinedUsernameResolver(),
        RedefinedResolver.createRedefinedEmailResolver(),
        RedefinedResolver.createEnsResolver(),
      ]
    })

    await resolver.resolve("cifrex.evm", ["eth"]);

    expect(spyRedefinedEmailResolve).toHaveBeenCalled()
    expect(spyRedefinedUsernameResolve).toHaveBeenCalled()
    expect(spyEnsResolve).toHaveBeenCalled()
    expect(spyUnsResolve).not.toHaveBeenCalled()
  });

  test('SHOULD reresolve .sol IF provided from redefined resolvers with sol network', async () => {
    const resolver = new RedefinedResolver({
      resolvers: [
        RedefinedResolver.createRedefinedUsernameResolver(),
        RedefinedResolver.createRedefinedEmailResolver(),
        RedefinedResolver.createBonfidaResolver(),
      ]
    })

    spyRedefinedUsernameResolve.mockImplementation(async () => [{ addr: "0xUsername.sol", network: "sol" }]);
    spyRedefinedEmailResolve.mockImplementation(async () => [{ addr: "0xEmail.sol", network: "sol" }]);

    await resolver.resolve("testA");

    expect(spyRedefinedEmailResolve).toHaveBeenCalled()
    expect(spyRedefinedUsernameResolve).toHaveBeenCalled()
    expect(spySolResolve).toHaveBeenCalledTimes(3)
  });

  test('SHOULD resolve .sol only using bonfida IF vendors args is set to ["bonfida"]', async () => {
    const resolver = new RedefinedResolver({
      resolvers: [
        RedefinedResolver.createRedefinedUsernameResolver(),
        RedefinedResolver.createRedefinedEmailResolver(),
        RedefinedResolver.createBonfidaResolver(),
      ]
    })

    spyRedefinedUsernameResolve.mockImplementation(async () => [{ addr: "0xUsername.sol", network: "sol" }]);
    spyRedefinedEmailResolve.mockImplementation(async () => [{ addr: "0xEmail.sol", network: "sol" }]);

    await resolver.resolve("testA", undefined, undefined, ["bonfida"]);

    expect(spyRedefinedEmailResolve).not.toHaveBeenCalled()
    expect(spyRedefinedUsernameResolve).not.toHaveBeenCalled()
    expect(spySolResolve).toHaveBeenCalled()
  });

  test('SHOULD resolve .sol only using bonfida and redefined-username IF vendors args is set to ["bonfida", "redefined-username"]', async () => {
    const resolver = new RedefinedResolver({
      resolvers: [
        RedefinedResolver.createRedefinedUsernameResolver(),
        RedefinedResolver.createRedefinedEmailResolver(),
        RedefinedResolver.createBonfidaResolver(),
      ]
    })

    spyRedefinedUsernameResolve.mockImplementation(async () => [{ addr: "0xUsername.sol", network: "sol" }]);
    spyRedefinedEmailResolve.mockImplementation(async () => [{ addr: "0xEmail.sol", network: "sol" }]);

    await resolver.resolve("testA", undefined, undefined, ["bonfida", "redefined-username"]);

    expect(spyRedefinedEmailResolve).not.toHaveBeenCalled()
    expect(spyRedefinedUsernameResolve).toHaveBeenCalled()
    expect(spySolResolve).toHaveBeenCalledTimes(2)
  });

  test('SHOULD remove reresolved .sol name from result', async () => {
    const resolver = new RedefinedResolver({
      resolvers: [
        RedefinedResolver.createRedefinedEmailResolver(),
        RedefinedResolver.createBonfidaResolver(),
      ]
    })

    spyRedefinedEmailResolve.mockImplementation(async () => [{ addr: "0xEmail.sol", network: "sol" }]);

    spySolResolve.mockImplementation(async (address) => address == "0xEmail.sol" ? [{
      address: "4DbiZPib1MvF",
      network: "sol",
      from: "bonfida"
    }] : []);

    const result = await resolver.resolve("testA");

    expect(spyRedefinedEmailResolve).toHaveBeenCalled()
    expect(spySolResolve).toHaveBeenCalledTimes(2)
    expect(result).toEqual({
      "errors": [],
      "response": [{ "address": "4DbiZPib1MvF", "from": "bonfida", "network": "sol" }]
    })
  });

  test('SHOULD NOT reresolve .sol IF provided from redefined resolvers AND not in sol network', async () => {
    const resolver = new RedefinedResolver({
      resolvers: [
        RedefinedResolver.createRedefinedUsernameResolver(),
        RedefinedResolver.createRedefinedEmailResolver(),
        RedefinedResolver.createBonfidaResolver(),
      ]
    })

    spyRedefinedUsernameResolve.mockImplementation(async () => [{ addr: "0xUsername.sol", network: "eth" }]);

    await resolver.resolve("testA");

    expect(spyRedefinedEmailResolve).toHaveBeenCalled()
    expect(spyRedefinedUsernameResolve).toHaveBeenCalled()
    expect(spySolResolve).toHaveBeenCalledTimes(1)
  });

  test('SHOULD NOT reresolve .sol IF provided from redefined resolvers AND not end with .sol', async () => {
    const resolver = new RedefinedResolver({
      resolvers: [
        RedefinedResolver.createRedefinedUsernameResolver(),
        RedefinedResolver.createRedefinedEmailResolver(),
        RedefinedResolver.createBonfidaResolver(),
      ]
    })

    spyRedefinedUsernameResolve.mockImplementation(async () => [{ addr: "0xUsername", network: "sol" }]);

    await resolver.resolve("testA");

    expect(spyRedefinedEmailResolve).toHaveBeenCalled()
    expect(spyRedefinedUsernameResolve).toHaveBeenCalled()
    expect(spySolResolve).toHaveBeenCalledTimes(1)
  });

  test('SHOULD NOT reresolve .sol IF provided from other then redefined resolvers', async () => {
    const resolver = new RedefinedResolver({
      resolvers: [
        RedefinedResolver.createBonfidaResolver(),
        RedefinedResolver.createSidBscResolver(),
      ]
    })

    spySidResolve.mockImplementation(async () => [{ address: "test.sol", network: "sol", from: "sid" }]);

    await resolver.resolve("testA");

    expect(spySidResolve).toHaveBeenCalled()
    expect(spySolResolve).toHaveBeenCalledTimes(1)
  });

  test('SHOULD throw error on set resolvers IF provided nothing', async () => {

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

    expect(resolver["resolvers"].length).toBe([
      RedefinedUsernameResolverService,
      RedefinedEmailResolverService,
      EnsResolverService,
      UnstoppableResolverService,
      SidResolverService, // bsc
      SidResolverService, // arb-1
      SidResolverService, // arb-nova
      BonfidaResolverService,
      LensResolverService
    ].length);

    expect(spyRedefinedEmailResolve).toHaveBeenCalled()
    expect(spyRedefinedUsernameResolve).toHaveBeenCalled()
    expect(spyEnsResolve).toHaveBeenCalled()
    expect(spyUnsResolve).toHaveBeenCalled()
    expect(spySidResolve).toHaveBeenCalledTimes(3)
    expect(spySolResolve).toHaveBeenCalledTimes(1)
    expect(spyLensResolve).toHaveBeenCalledTimes(1)
  });

  test('SHOULD resolve only with target network IF provided', async () => {
    const networks = ["eth", "sol", "zil", "bsc"];

    const resolver = new RedefinedResolver({
      resolvers: [RedefinedResolver.createRedefinedUsernameResolver(), RedefinedResolver.createRedefinedEmailResolver()]
    });

    resetRedefinedImplementationWithNetworks(networks)

    const callTest = async (network: string) => {
      expect(await resolver.resolve("cifrex.eth", [network])).toEqual({
        errors: [],
        response: [
          { address: "0xUsername", network, from: "redefined-username" },
          { address: "0xEmail", network, from: "redefined-email" },
        ]
      });
    }

    await Promise.all(networks.map((it) => callTest(it)));
  });

  test('SHOULD resolve with evm network IF target network not resolved', async () => {
    const resolver = new RedefinedResolver({
      resolvers: [RedefinedResolver.createRedefinedUsernameResolver(), RedefinedResolver.createRedefinedEmailResolver()]
    });

    const networks = ["eth", "evm"];
    resetRedefinedImplementationWithNetworks(networks)

    expect(await resolver.resolve("cifrex.eth", ["bsc"])).toEqual({
      errors: [],
      response: [
        { address: "0xUsername", network: "evm", from: "redefined-username" },
        { address: "0xEmail", network: "evm", from: "redefined-email" },
      ]
    });
  });

  test('SHOULD NOT resolve with evm network IF target network resolved', async () => {
    const resolver = new RedefinedResolver({
      resolvers: [RedefinedResolver.createRedefinedUsernameResolver(), RedefinedResolver.createRedefinedEmailResolver()]
    });

    const networks = ["eth", "evm"];
    resetRedefinedImplementationWithNetworks(networks)

    expect(await resolver.resolve("cifrex.eth", ["eth"])).toEqual({
      errors: [],
      response: [
        { address: "0xUsername", network: "eth", from: "redefined-username" },
        { address: "0xEmail", network: "eth", from: "redefined-email" },
      ]
    });
  });

  test('SHOULD NOT resolve with evm network IF provided option', async () => {
    const resolver = new RedefinedResolver({
      resolvers: [
        RedefinedResolver.createRedefinedEmailResolver({
          allowDefaultEvmResolves: false,
        }),
        RedefinedResolver.createRedefinedUsernameResolver({
          allowDefaultEvmResolves: false,
        })]
    });

    const networks = ["eth", "evm"];
    resetRedefinedImplementationWithNetworks(networks)

    expect(await resolver.resolve("cifrex.eth", ["bsc"])).toEqual({
      errors: [],
      response: [],
    });
  });

  test('SHOULD use custom resolver IF provided', async () => {
    const spyCustomResolve = jest.spyOn(CustomResolver.prototype, 'resolve');

    const resolver = new RedefinedResolver({
      resolvers: [
        ...RedefinedResolver.createDefaultResolvers(),
        new CustomResolver()
      ]
    });

    await resolver.resolve("ivan.eth", undefined, { throwErrorOnInvalidDomain: true });

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
        new CustomResolver(),
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
      resolvers: [customResolver],
    });

    await resolver.resolve("domain");

    expect(spyRedefinedEmailResolve).not.toHaveBeenCalled()
    expect(spyRedefinedUsernameResolve).not.toHaveBeenCalled()
    expect(spyEnsResolve).not.toHaveBeenCalled()
    expect(spyUnsResolve).not.toHaveBeenCalled()
    expect(spyCustomResolve).toHaveBeenCalled()
  });

  test('SHOULD wrapped resolver in proxy IF create default resolver', async () => {
    RedefinedResolver.createDefaultResolvers().forEach(r => {
      expect(r).toBeInstanceOf(BulkProxy);
    })
  });

  test('SHOULD fetch configs for resolvers IF custom resolvers not provided', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-01-01'));
    const resolver = new RedefinedResolver();

    await resolver.resolve("domain");

    expect((global as any).fetch).toHaveBeenCalled();
    expect((global as any).fetch).toHaveBeenCalledWith(`${config.CONFIGS_URL}?v=${new Date().valueOf()}`);
  });

  test('SHOULD NOT fetch configs for resolvers IF custom resolvers provided', async () => {
    const resolver = new RedefinedResolver({
      resolvers: [RedefinedResolver.createEnsResolver()]
    });

    await resolver.resolve("domain");

    expect((global as any).fetch).not.toHaveBeenCalled();
    expect((global as any).fetch).not.toHaveBeenCalledWith(config.CONFIGS_URL);
  });

  test('SHOULD call resolve with custom options IF provided', async () => {
    const customResolver = new CustomResolver();
    const spyResolve = jest.spyOn(customResolver, 'resolve');

    const resolver = new RedefinedResolver({
      resolvers: [customResolver],
    });

    await resolver.resolve("domain", undefined, { customOption: "customOption" });

    expect(spyResolve).toHaveBeenLastCalledWith("domain", undefined, { customOption: "customOption" })
  });

  test('SHOULD get errors in response IF resolver failed', async () => {
    const customResolver = new CustomResolver();

    jest.spyOn(customResolver, 'resolve').mockImplementation(async () => {
      throw Error("Custom error")
    });

    const resolver = new RedefinedResolver({ resolvers: [...[RedefinedResolver.createRedefinedUsernameResolver(), RedefinedResolver.createRedefinedEmailResolver()], customResolver] });

    const response = await resolver.resolve("domain");

    expect(response).toEqual({
      response: [
        { address: "0xUsername", network: "eth", from: "redefined-username" },
        { address: "0xEmail", network: "eth", from: "redefined-email" },
      ],
      errors: [
        { vendor: customResolver.vendor, error: "Custom error" }
      ],
    })
  });

  test('SHOULD implement all files in "resolvers" folder', async () => {
    const resolversFolder = 'src/services/resolvers/';
    const mainResolverFile = 'src/redefined.resolver.ts';

    const resolverFilesNames = fs.readdirSync(resolversFolder)
      .filter(it => it.includes("-resolver.service.ts") && it !== "redefined-resolver.service.ts")
      .map(it => it.slice(0, it.length - 3));

    const resolverFileText = fs.readFileSync(mainResolverFile, 'utf8');

    expect(resolverFilesNames.every(it => resolverFileText.includes(it))).toBe(true)
  });

  test('SHOULD reverse unstoppable only IF vendors args is set to ["unstoppable"]', async () => {
    const resolver = new RedefinedResolver({
      resolvers: [
        RedefinedResolver.createUnstoppableResolver(),
        RedefinedResolver.createRedefinedEmailResolver(),
        RedefinedResolver.createBonfidaResolver(),
      ]
    })

    await resolver.reverse("0x123", ["unstoppable"]);

    expect(spyUnsReverse).toHaveBeenCalled();
    expect(spyRedefinedEmailResolve).not.toHaveBeenCalled();
    expect(spySolReverse).not.toHaveBeenCalled();
  });

  test('SHOULD reverse all vendors IF vendors args not set', async () => {
    const resolver = new RedefinedResolver({
      resolvers: [
        RedefinedResolver.createUnstoppableResolver(),
        RedefinedResolver.createEnsResolver(),
        RedefinedResolver.createBonfidaResolver(),
      ]
    })

    await resolver.reverse("0x123");

    expect(spyUnsReverse).toHaveBeenCalled();
    expect(spyEnsReverse).toHaveBeenCalled();
    expect(spySolReverse).toHaveBeenCalled();
  });

  test('SHOULD reverse address and return correct result IF address reversable in at least one vendor', async () => {
    const resolver = new RedefinedResolver({
      resolvers: [
        RedefinedResolver.createUnstoppableResolver(),
        RedefinedResolver.createEnsResolver(),
        RedefinedResolver.createBonfidaResolver(),
        RedefinedResolver.createLensResolver(),
      ]
    })

    jest.spyOn(UnstoppableResolverService.prototype, 'reverse').mockImplementation(async () => {
      throw Error("Custom error")
    });
    jest.spyOn(BonfidaResolverService.prototype, 'reverse').mockImplementation(async () => {
      throw Error("Custom error")
    });
    jest.spyOn(LensResolverService.prototype, 'reverse').mockImplementation(async () => {
      throw Error("Custom error")
    });

    const result = await resolver.reverse("0x123");

    expect(spyUnsReverse).toHaveBeenCalled();
    expect(spyEnsReverse).toHaveBeenCalled();
    expect(spySolReverse).toHaveBeenCalled();
    expect(spyLensReverse).toHaveBeenCalled();

    expect(result.response).toEqual(
      [
        {
          domain: "nick.eth",
          from: "ens"
        }
      ]
    );

    expect(result.errors).toEqual(expect.arrayContaining(
      [
        {
          error: "Custom error",
          vendor: "unstoppable"
        },
        {
          error: "Custom error",
          vendor: "lens"
        },
        {
          error: "Custom error",
          vendor: "bonfida"
        }
      ]
    ))
  });
});
