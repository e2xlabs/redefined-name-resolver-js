const Web3 = require('web3')

export default class EvmWeb3Service {

    static getWeb3(nodeLink: string) {
        return new Web3(nodeLink);
    }
    
    static getWeb3Http(nodeLink: string) {
        return new Web3.providers.HttpProvider(nodeLink);
    }
}
