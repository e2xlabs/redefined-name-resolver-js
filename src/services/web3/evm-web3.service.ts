import Web3 from "web3";
import { HttpProvider } from "web3-providers-http";

export default class EvmWeb3Service {

    static getWeb3(nodeLink: string): Web3 {
        return new Web3(new HttpProvider(nodeLink));
    }
}
