import { Chain } from "@/models/types";
import { networks } from "@/networks";
import * as solanaWeb3 from "@solana/web3.js";

export default class SolWeb3Service {

    static getWeb3(chain: Chain): solanaWeb3.Connection {
        if (chain !== Chain.SOL) throw Error(`${chain} not supported for sol web3`);

        return new solanaWeb3.Connection(solanaWeb3.clusterApiUrl(networks[chain].config.cluster as solanaWeb3.Cluster), "confirmed")
    }

}
