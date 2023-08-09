import { add } from "lodash";

const Web3 = require('web3')

export default class EvmWeb3Service {

    private static web3 = new Web3();

    static getWeb3(nodeLink: string) {
        return new Web3(nodeLink);
    }
    
    static getWeb3Http(nodeLink: string) {
        return new Web3.providers.HttpProvider(nodeLink);
    }

    static isValidAddress(address: string) {
        return this.web3.utils.isAddress(address);
    }
}
