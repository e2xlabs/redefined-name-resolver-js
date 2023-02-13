"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnsResolverService = void 0;
const tslib_1 = require("tslib");
const resolver_service_1 = require("@resolver/services/resolvers/resolver.service");
const evm_web3_service_1 = tslib_1.__importDefault(require("@resolver/services/web3/evm-web3.service"));
class EnsResolverService extends resolver_service_1.ResolverService {
    constructor() {
        super(...arguments);
        this.supportedNetworks = ["eth", "bsc"];
    }
    resolve(domain, network, nodeLink) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.isSupportedNetwork(network)) {
                console.log(`${network} not supported by Ens.`);
                return [];
            }
            try {
                return [{
                        address: yield evm_web3_service_1.default.getWeb3(nodeLink).eth.ens.getAddress(domain),
                        network: network,
                        from: "ens"
                    }];
            }
            catch (e) {
                console.error("ENS Error", e.message);
                return [];
            }
        });
    }
}
exports.EnsResolverService = EnsResolverService;
//# sourceMappingURL=ens-resolver.service.js.map