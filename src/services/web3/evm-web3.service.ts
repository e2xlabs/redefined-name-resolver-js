import Web3 from "web3";
import { HttpProvider } from "web3-providers-http";

export default class EvmWeb3Service {

    static getWeb3(nodeLink: string): Web3 {
        const provider = new HttpProvider(nodeLink);
        return new Web3(provider);
    }
}
