import { Chain } from "@/models/types";
import { networks } from "@/networks";
import * as solanaWeb3 from "@solana/web3.js";

export default class SolWeb3Service {

    static getWeb3(chainKey: Chain): solanaWeb3.Connection {
        return new solanaWeb3.Connection(solanaWeb3.clusterApiUrl(networks[chainKey].config.cluster), "confirmed")
    }

}
