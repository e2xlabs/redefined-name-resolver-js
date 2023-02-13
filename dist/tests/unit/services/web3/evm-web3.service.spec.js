"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const evm_web3_service_1 = tslib_1.__importDefault(require("@resolver/services/web3/evm-web3.service"));
const config_1 = tslib_1.__importDefault(require("@resolver/config"));
describe('evm-web3.service', () => {
    test('SHOULD get web3 provider', () => {
        expect(evm_web3_service_1.default.getWeb3(config_1.default.ETH_NODE)).not.toBe(undefined);
    });
});
//# sourceMappingURL=evm-web3.service.spec.js.map