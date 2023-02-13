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
exports.RedefinedResolver = void 0;
const redefined_resolver_service_1 = require("@resolver/services/resolvers/redefined-resolver.service");
const ens_resolver_service_1 = require("@resolver/services/resolvers/ens-resolver.service");
const unstoppable_resolver_service_1 = require("@resolver/services/resolvers/unstoppable-resolver.service");
const lodash_1 = require("lodash");
const config_1 = require("@resolver/config");
const redefinedResolverService = new redefined_resolver_service_1.RedefinedResolverService();
const ensResolverService = new ens_resolver_service_1.EnsResolverService();
const unstoppableResolverService = new unstoppable_resolver_service_1.UnstoppableResolverService();
const resolverServicesByType = {
    redefined: redefinedResolverService,
    ens: ensResolverService,
    unstoppable: unstoppableResolverService,
};
class RedefinedResolver {
    constructor(options) {
        var _a, _b;
        this.options = options;
        this.resolverServices = [redefinedResolverService, ensResolverService, unstoppableResolverService];
        this.nodes = {
            eth: config_1.default.ETH_NODE,
            bsc: config_1.default.BSC_NODE,
            sol: config_1.default.SOL_NODE,
        };
        const resolverServices = (_a = this.options) === null || _a === void 0 ? void 0 : _a.resolverServices;
        const nodes = (_b = this.options) === null || _b === void 0 ? void 0 : _b.nodes;
        if (resolverServices && !resolverServices.length) {
            throw Error("“resolverServices” option must be a non-empty array or falsy");
        }
        if (nodes && !Object.keys(nodes).length) {
            throw Error("“nodes” option must be a non-empty array or falsy");
        }
        if (resolverServices) {
            this.resolverServices = resolverServices.map(it => resolverServicesByType[it]);
        }
        if (nodes) {
            this.nodes = Object.assign(Object.assign({}, this.nodes), nodes);
        }
    }
    resolve(domain, networks) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, lodash_1.flatten)(yield Promise.all(this.resolverServices.map(resolver => resolver.resolveAll(domain, this.nodes)))).filter(it => !networks || networks.includes(it.network));
        });
    }
}
exports.RedefinedResolver = RedefinedResolver;
