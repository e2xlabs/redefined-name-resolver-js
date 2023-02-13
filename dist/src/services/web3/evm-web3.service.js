"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const web3_1 = tslib_1.__importDefault(require("web3"));
class EvmWeb3Service {
    static getWeb3(nodeLink) {
        return new web3_1.default(new web3_1.default.providers.HttpProvider(nodeLink));
    }
}
exports.default = EvmWeb3Service;
//# sourceMappingURL=evm-web3.service.js.map