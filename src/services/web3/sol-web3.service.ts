import { Network } from "@/models/types";
import { networks } from "@/networks";
import * as solanaWeb3 from "@solana/web3.js";

export default class SolWeb3Service {

    static getWeb3(network: Network): solanaWeb3.Connection {
        if (network !== Network.SOL) throw Error(`${network} not supported for sol web3`);

        return new solanaWeb3.Connection(solanaWeb3.clusterApiUrl(networks[network].config.cluster as solanaWeb3.Cluster), "confirmed")
    }

}
