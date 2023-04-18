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

describe('redefined.resolver', () => {
  const spyRedefinedUsernameResolve = jest.spyOn(RedefinedUsernameResolverService.prototype, 'resolveDomain');
  const spyRedefinedEmailResolve = jest.spyOn(RedefinedEmailResolverService.prototype, 'resolveDomain');
  const spyEnsResolve = jest.spyOn(EnsResolverService.prototype, 'resolve');
  const spyUnsResolve = jest.spyOn(UnstoppableResolverService.prototype, 'resolve');
  const spySidResolve = jest.spyOn(SidResolverService.prototype, 'resolve');
  const spySolResolve = jest.spyOn(BonfidaResolverService.prototype, 'resolve');
  const spyLensResolve = jest.spyOn(LensResolverService.prototype, 'resolve');

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
    spySidResolve.mockReset();
    spySolResolve.mockReset();
    spyLensResolve.mockReset();

    spyRedefinedUsernameResolve.mockImplementation(async () => [{ addr: "0xUsername", network: "eth" }]);
    spyRedefinedEmailResolve.mockImplementation(async () => [{ addr: "0xEmail", network: "eth" }]);
    spyEnsResolve.mockImplementation(async () => [{ address: "0x123", network: "eth", from: "ens" }]);
    spyUnsResolve.mockImplementation(async () => [{ address: "0x123", network: "eth", from: "unstoppable" }]);
    spySidResolve.mockImplementation(async () => [{ address: "0x123", network: "bsc", from: "sid" }]);
    spySolResolve.mockImplementation(async () => [{ address: "4DbiZPib1MvF", network: "sol", from: "bonfida" }]);
    spyLensResolve.mockImplementation(async () => [{ address: "0x123", network: "evm", from: "lens" }]);
  })

  test('SHOULD call resolvers IF provided', async () => {
    const resolver = new RedefinedResolver({
      resolvers: [
        ...[RedefinedResolver.createRedefinedUsernameResolver(), RedefinedResolver.createRedefinedEmailResolver()],
        RedefinedResolver.createEnsResolver(),
      ]
    })

    await resolver.resolve("cifrex.evm", ["eth"]);

    expect(spyRedefinedEmailResolve).toHaveBeenCalled()
    expect(spyRedefinedUsernameResolve).toHaveBeenCalled()
    expect(spyEnsResolve).toHaveBeenCalled()
    expect(spyUnsResolve).not.toHaveBeenCalled()
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
    const networks= ["eth", "sol", "zil", "bsc"];

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

    await resolver.resolve("ivan.eth", undefined, { throwErrorOnInvalidDomain: true,});

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
});
