"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const config_1 = tslib_1.__importDefault(require("@resolver/config"));
const redefined_resolver_service_1 = require("@resolver/services/resolvers/redefined-resolver.service");
const redefinedResolverService = new redefined_resolver_service_1.RedefinedResolverService();
describe('redefined-resolver.service with provider', () => {
    test('SHOULD get addresses for domain with network IF networks supported', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const networks = ["eth"];
        const callTest = (network) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            expect(yield redefinedResolverService.resolve("cifrex.eth", network, config_1.default.ETH_NODE)).toEqual([
                { address: "0x123", network: "eth", from: "redefined", },
                { address: "0x323", network: "sol", from: "redefined", }
            ]);
        });
        yield Promise.all(networks.map((it) => callTest(it)));
    }));
    test('SHOULD get empty response IF networks redefined', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const networks = ["sol", "zil", "bsc"];
        const callTest = (network) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            expect(yield redefinedResolverService.resolve("cifrex.eth", network, config_1.default.ETH_NODE)).toEqual([]);
        });
        yield Promise.all(networks.map((it) => callTest(it)));
    }));
});
//# sourceMappingURL=redefined-resolver.service.spec.js.map