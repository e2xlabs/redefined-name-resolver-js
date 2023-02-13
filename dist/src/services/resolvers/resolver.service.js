"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResolverService = void 0;
const tslib_1 = require("tslib");
const lodash_1 = require("lodash");
class ResolverService {
    isSupportedNetwork(network) {
        return this.supportedNetworks.some(it => it === network);
    }
    resolveAll(domain, nodes) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const serviceNodes = this.supportedNetworks.map(it => ({ network: it, node: nodes[it] }));
            return (0, lodash_1.flatten)(yield Promise.all(serviceNodes.map(it => this.resolve(domain, it.network, it.node))));
        });
    }
}
exports.ResolverService = ResolverService;
//# sourceMappingURL=resolver.service.js.map