import { EnsResolverService } from "@/services/resolvers/ens-resolver.service";
import { UnstoppableResolverService } from "@/services/resolvers/unstoppable-resolver.service";
import { RedefinedResolverService } from "@/services/resolvers/redefined-resolver.service";
import { Chain, ResolverServices } from "@/models/types";
import { Resolver } from "@/models/resolver";

describe('resolver', () => {
  const spyRedefinedResolve = jest.spyOn(RedefinedResolverService.prototype, 'resolve');
  const spyEncResolve = jest.spyOn(EnsResolverService.prototype, 'resolve');
  const spyUnsResolve = jest.spyOn(UnstoppableResolverService.prototype, 'resolve');

  beforeEach(() => {
    spyRedefinedResolve.mockClear();
    spyEncResolve.mockClear();
    spyUnsResolve.mockClear();
    spyRedefinedResolve.mockImplementation(async () => ["0x123"]);
    spyEncResolve.mockImplementation(async () => ["0x123"]);
    spyUnsResolve.mockImplementation(async () => ["0x123"]);
  })

  test('SHOULD use provided resolvers IF exists', async () => {
    const resolver = new Resolver({
      resolvers: [ResolverServices.REDEFINED]
    })
    expect(resolver["resolvers"]).toEqual([RedefinedResolverService.prototype]);
  });

  test('SHOULD show error on create instance IF resolvers exists but provided nothing', async () => {
    try {
      new Resolver({ resolvers: [] })
    } catch (e) {
      expect(e.message).toBe("You need to provide the resolvers you want to use or provide nothing!")
    }
  });

  test('SHOULD call resolvers IF provided', async () => {
    const resolver = new Resolver({
      resolvers: [ResolverServices.REDEFINED, ResolverServices.ENS]
    })

    await resolver.resolve("hui.evm", Chain.ETH);

    expect(spyRedefinedResolve).toHaveBeenCalled()
    expect(spyEncResolve).toHaveBeenCalled()
    expect(spyUnsResolve).not.toHaveBeenCalled()
  });

  test('SHOULD call all resolvers IF none are provided', async () => {
    const resolver = new Resolver();

    await resolver.resolve("hui.evm", Chain.ETH);

    expect(spyRedefinedResolve).toHaveBeenCalled()
    expect(spyEncResolve).toHaveBeenCalled()
    expect(spyUnsResolve).toHaveBeenCalled()
  });
});
