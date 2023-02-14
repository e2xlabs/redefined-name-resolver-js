"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Web3 = require('web3');
class EvmWeb3Service {
    static getWeb3(nodeLink) {
        return new Web3(nodeLink);
    }
}
exports.default = EvmWeb3Service;
