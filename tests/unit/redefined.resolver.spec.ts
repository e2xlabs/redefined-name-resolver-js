import { EnsResolverService } from "@/services/resolvers/ens-resolver.service";
import { UnstoppableResolverService } from "@/services/resolvers/unstoppable-resolver.service";
import { RedefinedResolverService } from "@/services/resolvers/redefined-resolver.service";
import { Network, ResolverServices } from "@/models/types";
import { RedefinedResolver } from "@/redefined.resolver";

describe('redefined.resolver', () => {
  const spyRedefinedResolve = jest.spyOn(RedefinedResolverService.prototype, 'resolve');
  const spyEncResolve = jest.spyOn(EnsResolverService.prototype, 'resolve');
  const spyUnsResolve = jest.spyOn(UnstoppableResolverService.prototype, 'resolve');

  beforeEach(() => {
    spyRedefinedResolve.mockClear();
    spyEncResolve.mockClear();
    spyUnsResolve.mockClear();
    spyRedefinedResolve.mockImplementation(async () => [{ address: "0x123", network: Network.ETH }]);
    spyEncResolve.mockImplementation(async () => [{ address: "0x123", network: Network.ETH }]);
    spyUnsResolve.mockImplementation(async () => [{ address: "0x123", network: Network.ETH }]);
  })

  test('SHOULD use provided resolvers IF exists', async () => {
    const resolver = new RedefinedResolver({
      resolverServices: [ResolverServices.REDEFINED]
    })
    // to bypass privacy
    expect(resolver["resolverServices"]).toEqual([RedefinedResolverService.prototype]);
  });

  test('SHOULD show error on create instance IF resolvers exists but provided nothing', async () => {
    try {
      new RedefinedResolver({ resolverServices: [] })
    } catch (e) {
      expect(e.message).toBe("You need to provide the resolvers you want to use or provide nothing!")
    }
  });

  test('SHOULD call resolvers IF provided', async () => {
    const resolver = new RedefinedResolver({
      resolverServices: [ResolverServices.REDEFINED, ResolverServices.ENS]
    })

    await resolver.resolve("hui.evm", Network.ETH);

    expect(spyRedefinedResolve).toHaveBeenCalled()
    expect(spyEncResolve).toHaveBeenCalled()
    expect(spyUnsResolve).not.toHaveBeenCalled()
  });

  test('SHOULD call all resolvers IF none are provided', async () => {
    const resolver = new RedefinedResolver();

    await resolver.resolve("hui.evm", Network.ETH);

    expect(spyRedefinedResolve).toHaveBeenCalled()
    expect(spyEncResolve).toHaveBeenCalled()
    expect(spyUnsResolve).toHaveBeenCalled()
  });
});
