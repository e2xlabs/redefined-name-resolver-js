"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const evm_web3_service_1 = tslib_1.__importDefault(require("@resolver/services/web3/evm-web3.service"));
evm_web3_service_1.default.getWeb3 = jest.fn().mockImplementation((network) => ({
    eth: {
        ens: {
            getAddress(domain) {
                return tslib_1.__awaiter(this, void 0, void 0, function* () {
                    return "0x123";
                });
            }
        },
        Contract: class Contract {
            constructor() {
                this.methods = {
                    resolve(domain) {
                        return {
                            call() {
                                return tslib_1.__awaiter(this, void 0, void 0, function* () {
                                    return [
                                        { addr: "0x123", network: "eth" },
                                        { addr: "0x323", network: "sol" }
                                    ];
                                });
                            },
                        };
                    }
                };
            }
        }
    }
}));
//# sourceMappingURL=web3.js.map