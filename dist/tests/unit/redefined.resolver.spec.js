"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ens_resolver_service_1 = require("@resolver/services/resolvers/ens-resolver.service");
const unstoppable_resolver_service_1 = require("@resolver/services/resolvers/unstoppable-resolver.service");
const redefined_resolver_service_1 = require("@resolver/services/resolvers/redefined-resolver.service");
const redefined_resolver_1 = require("@resolver/redefined.resolver");
const config_1 = tslib_1.__importDefault(require("@resolver/config"));
const evm_web3_service_1 = tslib_1.__importDefault(require("@resolver/services/web3/evm-web3.service"));
describe('redefined.resolver', () => {
    const spyRedefinedResolve = jest.spyOn(redefined_resolver_service_1.RedefinedResolverService.prototype, 'resolve');
    const spyEncResolve = jest.spyOn(ens_resolver_service_1.EnsResolverService.prototype, 'resolve');
    const spyUnsResolve = jest.spyOn(unstoppable_resolver_service_1.UnstoppableResolverService.prototype, 'resolve');
    beforeEach(() => {
        spyRedefinedResolve.mockClear();
        spyEncResolve.mockClear();
        spyUnsResolve.mockClear();
        spyRedefinedResolve.mockImplementation(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return [{ address: "0x123", network: "eth", from: "redefined" }]; }));
        spyEncResolve.mockImplementation(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return [{ address: "0x123", network: "eth", from: "ens" }]; }));
        spyUnsResolve.mockImplementation(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return [{ address: "0x123", network: "eth", from: "unstoppable" }]; }));
    });
    test('SHOULD use provided resolvers IF exists', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const resolver = new redefined_resolver_1.RedefinedResolver({
            resolverServices: ["redefined"]
        });
        // to bypass privacy
        expect(resolver["resolverServices"]).toEqual([new redefined_resolver_service_1.RedefinedResolverService()]);
    }));
    test('SHOULD show error on create instance IF resolvers exists but provided nothing', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            new redefined_resolver_1.RedefinedResolver({ resolverServices: [] });
        }
        catch (e) {
            expect(e.message).toBe("“resolverServices” option must be a non-empty array or falsy");
        }
    }));
    test('SHOULD call resolvers IF provided', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const resolver = new redefined_resolver_1.RedefinedResolver({
            resolverServices: ["redefined", "ens"]
        });
        yield resolver.resolve("cifrex.evm", ["eth"]);
        expect(spyRedefinedResolve).toHaveBeenCalled();
        expect(spyEncResolve).toHaveBeenCalled();
        expect(spyUnsResolve).not.toHaveBeenCalled();
    }));
    test('SHOULD call all resolvers IF none are provided', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const resolver = new redefined_resolver_1.RedefinedResolver();
        yield resolver.resolve("cifrex.evm", ["eth"]);
        expect(spyRedefinedResolve).toHaveBeenCalled();
        expect(spyEncResolve).toHaveBeenCalled();
        expect(spyUnsResolve).toHaveBeenCalled();
    }));
    test('SHOULD use preinstalled nodes IF none are provided', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const resolver = new redefined_resolver_1.RedefinedResolver();
        expect(resolver["nodes"]).toEqual({
            eth: config_1.default.ETH_NODE,
            bsc: config_1.default.BSC_NODE,
            sol: config_1.default.SOL_NODE,
        });
    }));
    test('SHOULD use nodes IF provided', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const resolver = new redefined_resolver_1.RedefinedResolver({
            nodes: { eth: "eth_node" }
        });
        expect(resolver["nodes"]).toEqual({
            eth: "eth_node",
            bsc: config_1.default.BSC_NODE,
            sol: config_1.default.SOL_NODE,
        });
    }));
    test('SHOULD call web3 in resolver with target node IF provided', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const spyGetEvmWeb3 = jest.spyOn(evm_web3_service_1.default, "getWeb3");
        spyEncResolve.mockImplementation((domain, network, nodeLink) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            evm_web3_service_1.default.getWeb3(nodeLink);
            return [];
        }));
        const resolver = new redefined_resolver_1.RedefinedResolver({
            resolverServices: ["ens"],
            nodes: { eth: "eth_node" }
        });
        yield resolver.resolve("cifrex.eth", ["eth"]);
        expect(spyGetEvmWeb3).toHaveBeenCalledWith("eth_node");
    }));
    test('SHOULD show error on create instance IF nodes exists but provided nothing', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            new redefined_resolver_1.RedefinedResolver({ nodes: {} });
        }
        catch (e) {
            expect(e.message).toBe("“nodes” option must be a non-empty array or falsy");
        }
    }));
});
//# sourceMappingURL=redefined.resolver.spec.js.map