"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ens_resolver_service_1 = require("@resolver/services/resolvers/ens-resolver.service");
const config_1 = tslib_1.__importDefault(require("@resolver/config"));
const ensResolverService = new ens_resolver_service_1.EnsResolverService();
describe('ens-resolver.service', () => {
    test('SHOULD get addresses for domain with network IF networks supported', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const networks = ["eth", "bsc"];
        const callTest = (network) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            expect(yield ensResolverService.resolve("ivan.eth", network, config_1.default.ETH_NODE)).toEqual([{ address: "0x123", network, from: "ens", }]);
        });
        yield Promise.all(networks.map((it) => callTest(it)));
    }));
    test('SHOULD get empty response IF networks unsupported', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const networks = ["sol", "zil"];
        const callTest = (network) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            expect(yield ensResolverService.resolve("cifrex.eth", network, config_1.default.ETH_NODE)).toEqual([]);
        });
        yield Promise.all(networks.map((it) => callTest(it)));
    }));
});
//# sourceMappingURL=ens-resolver.service.spec.js.map