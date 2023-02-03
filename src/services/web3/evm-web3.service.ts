import Web3 from "web3";

export default class EvmWeb3Service {

    static getWeb3(nodeLink: string): Web3 {
        return new Web3(new Web3.providers.HttpProvider(nodeLink));
    }
}
