"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ETH_GOERLI_NODE = "https://nameless-frequent-sea.ethereum-goerli.discover.quiknode.pro/251fd072d4269477a9053b036f131705359808f8/";
const ETH_MAIN_NODE = "https://attentive-blue-choice.discover.quiknode.pro/a6d16bf50e42db77cd315b60e2c1f5c2386537e3/";
exports.default = {
    REDEFINED_EMAIL_RESOLVER_CONTRACT_ADDRESS: "0x56910F4bC69aE6A7B41Cdcf0F73A57c26378923d",
    ETH_NODE: process.env.NODE_ENV === "development" ? ETH_GOERLI_NODE : ETH_MAIN_NODE,
    BSC_NODE: "https://bsc-dataseed.binance.org",
    SOL_NODE: "mainnet-beta",
};
//# sourceMappingURL=config.js.map