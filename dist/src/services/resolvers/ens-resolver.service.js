"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnsResolverService = void 0;
const resolver_service_1 = require("./resolver.service");
const evm_web3_service_1 = require("../web3/evm-web3.service");
class EnsResolverService extends resolver_service_1.ResolverService {
    constructor() {
        super(...arguments);
        this.supportedNetworks = ["eth", "bsc"];
    }
    resolve(domain, network, nodeLink) {
        return __awaiter(this, void 0, void 0, function* () {
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
