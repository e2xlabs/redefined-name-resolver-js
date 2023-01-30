import Web3 from "web3";
import { networks } from "@/networks";
import { Chain } from "@/models/types";

export default class EvmWeb3Service {

    static getWeb3(chain: Chain): Web3 {
        return new Web3(new Web3.providers.HttpProvider(networks[chain].config.url));
    }
}
