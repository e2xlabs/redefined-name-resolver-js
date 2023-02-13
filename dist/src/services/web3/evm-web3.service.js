"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const web3_1 = require("web3");
const web3_providers_http_1 = require("web3-providers-http");
class EvmWeb3Service {
    static getWeb3(nodeLink) {
        return new web3_1.default(new web3_providers_http_1.HttpProvider(nodeLink));
    }
}
exports.default = EvmWeb3Service;
