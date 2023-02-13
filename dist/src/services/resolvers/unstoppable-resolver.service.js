"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnstoppableResolverService = void 0;
const tslib_1 = require("tslib");
const resolver_service_1 = require("@resolver/services/resolvers/resolver.service");
const resolution_1 = tslib_1.__importDefault(require("@unstoppabledomains/resolution"));
const resolution = new resolution_1.default();
class UnstoppableResolverService extends resolver_service_1.ResolverService {
    constructor() {
        super(...arguments);
        this.supportedNetworks = ["eth", "bsc", "zil"];
    }
    resolve(domain, network, nodeLink) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.isSupportedNetwork(network)) {
                console.log(`${network} not supported by Unstoppable.`);
                return [];
            }
            try {
                if (!(yield resolution.isRegistered(domain))) {
                    console.log(`${domain} not registered with Unstoppable.`);
                    return [];
                }
                return [{
                        address: yield resolution.addr(domain, network),
                        network: network,
                        from: "unstoppable"
                    }];
            }
            catch (e) {
                console.error("Unstoppable Error", e.message);
                return [];
            }
        });
    }
}
exports.UnstoppableResolverService = UnstoppableResolverService;
//# sourceMappingURL=unstoppable-resolver.service.js.map