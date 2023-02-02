const ETH_GOERLI_NODE = "";
const ETH_MAIN_NODE = "https://attentive-blue-choice.discover.quiknode.pro/a6d16bf50e42db77cd315b60e2c1f5c2386537e3/";

export default {
    CONTRACT_ADDRESS: "0x56910F4bC69aE6A7B41Cdcf0F73A57c26378923d",
    WALLET_INSTALL_LINK: "https://chrome.google.com/webstore/detail/redefined/ojnickmaddieljpcdmedagfejfkmbaoe?hl=en&authuser=0",
    ETH_NODE: process.env.NODE_ENV === "development" ? ETH_GOERLI_NODE : ETH_MAIN_NODE,
    BSC_NODE: "https://bsc-dataseed.binance.org",
    SOL_NODE: "mainnet-beta",
}
