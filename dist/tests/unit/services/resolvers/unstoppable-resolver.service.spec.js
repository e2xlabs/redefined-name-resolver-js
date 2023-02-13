"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const unstoppable_resolver_service_1 = require("@resolver/services/resolvers/unstoppable-resolver.service");
const resolution_1 = tslib_1.__importDefault(require("@unstoppabledomains/resolution"));
const config_1 = tslib_1.__importDefault(require("@resolver/config"));
describe('unstoppable-resolver.service', () => {
    beforeEach(() => {
        jest.spyOn(resolution_1.default.prototype, 'isRegistered').mockImplementation(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return true; }));
        jest.spyOn(resolution_1.default.prototype, 'addr').mockImplementation((domain, network) => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return "0x123"; }));
    });
    test('SHOULD get addresses for domain with network IF it is registered and available', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const unstoppableResolverService = new unstoppable_resolver_service_1.UnstoppableResolverService();
        const networks = ["eth", "bsc", "zil"];
        const callTest = (network) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            expect(yield unstoppableResolverService.resolve("cifrex.crypto", network, config_1.default.ETH_NODE)).toEqual([{ address: "0x123", network, from: "unstoppable" }]);
        });
        yield Promise.all(networks.map(callTest));
    }));
    test('SHOULD get empty response for unsupported networks', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const unstoppableResolverService = new unstoppable_resolver_service_1.UnstoppableResolverService();
        const networks = ["sol"];
        const callTest = (network) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            expect(yield unstoppableResolverService.resolve("cifrex.crypto", network, config_1.default.SOL_NODE)).toEqual([]);
        });
        yield Promise.all(networks.map(callTest));
    }));
    test('SHOULD get empty response for domain IF it is not registered', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const unstoppableResolverService = new unstoppable_resolver_service_1.UnstoppableResolverService();
        jest.spyOn(resolution_1.default.prototype, 'isRegistered').mockImplementation(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return false; }));
        expect(yield unstoppableResolverService.resolve("cifrex.crypto", "eth", config_1.default.ETH_NODE)).toEqual([]);
    }));
});
//# sourceMappingURL=unstoppable-resolver.service.spec.js.map