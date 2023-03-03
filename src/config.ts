import { CONTRACTS } from "@resolver/redefined-contracts";

export const NODES = {
    ARBITRUM_NODE: "https://thrumming-shy-shadow.arbitrum-mainnet.discover.quiknode.pro/8293587af0f7311ba25216d08c72844c9d39fdfe/",
    ETH_NODE: "https://attentive-blue-choice.discover.quiknode.pro/a6d16bf50e42db77cd315b60e2c1f5c2386537e3/",
    BSC_NODE: "https://bsc-dataseed.binance.org",
    ZIL_NODE: "https://evm-api-dev.zilliqa.com",
    POLYGON_NODE: "https://nameless-small-tree.matic.discover.quiknode.pro/1c4a2e33a0f87bf379039694c7de15aff5e0aaf5/",
}

export default {
    ...CONTRACTS,
    ...NODES,
}
