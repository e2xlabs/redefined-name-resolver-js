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
exports.ResolverService = void 0;
const lodash_1 = require("lodash");
class ResolverService {
    isSupportedNetwork(network) {
        return this.supportedNetworks.some(it => it === network);
    }
    resolveAll(domain, nodes) {
        return __awaiter(this, void 0, void 0, function* () {
            const serviceNodes = this.supportedNetworks.map(it => ({ network: it, node: nodes[it] }));
            return (0, lodash_1.flatten)(yield Promise.all(serviceNodes.map(it => this.resolve(domain, it.network, it.node))));
        });
    }
}
exports.ResolverService = ResolverService;
