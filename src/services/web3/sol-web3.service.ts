import * as solanaWeb3 from "@solana/web3.js";
import { Cluster } from "@solana/web3.js";

export default class SolWeb3Service {

    static getWeb3(nodeLink: string): solanaWeb3.Connection {
        return new solanaWeb3.Connection(solanaWeb3.clusterApiUrl(nodeLink as Cluster), "confirmed")
    }

}
