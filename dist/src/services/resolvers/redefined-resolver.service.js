"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedefinedResolverService = void 0;
const tslib_1 = require("tslib");
const resolver_service_1 = require("@resolver/services/resolvers/resolver.service");
const redefined_resolver_abi_1 = tslib_1.__importDefault(require("@resolver/services/abis/redefined-resolver.abi"));
const config_1 = tslib_1.__importDefault(require("@resolver/config"));
const utils_1 = require("@resolver/utils/utils");
const js_sha256_1 = require("js-sha256");
const evm_web3_service_1 = tslib_1.__importDefault(require("@resolver/services/web3/evm-web3.service"));
class RedefinedResolverService extends resolver_service_1.ResolverService {
    constructor() {
        super(...arguments);
        this.supportedNetworks = ["eth"];
    }
    resolve(domain, network, nodeLink) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.isSupportedNetwork(network)) {
                console.log(`${network} not supported by redefined.`);
                return [];
            }
            try {
                const web3 = evm_web3_service_1.default.getWeb3(nodeLink);
                const contract = new web3.eth.Contract(redefined_resolver_abi_1.default, config_1.default.REDEFINED_EMAIL_RESOLVER_CONTRACT_ADDRESS);
                return (yield contract.methods.resolve((0, utils_1.isEmail)(domain) ? (0, js_sha256_1.sha256)(domain) : domain).call()).map((it) => ({
                    address: it.addr,
                    network: it.network,
                    from: "redefined"
                }));
            }
            catch (e) {
                console.error("redefined Error", e.message);
                return [];
            }
        });
    }
}
exports.RedefinedResolverService = RedefinedResolverService;
//# sourceMappingURL=redefined-resolver.service.js.map