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
exports.UnstoppableResolverService = void 0;
const resolver_service_1 = require("@resolver/services/resolvers/resolver.service");
const resolution_1 = require("@unstoppabledomains/resolution");
const resolution = new resolution_1.default();
class UnstoppableResolverService extends resolver_service_1.ResolverService {
    constructor() {
        super(...arguments);
        this.supportedNetworks = ["eth", "bsc", "zil"];
    }
    resolve(domain, network, nodeLink) {
        return __awaiter(this, void 0, void 0, function* () {
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
