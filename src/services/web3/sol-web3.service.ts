import { Connection, clusterApiUrl, Cluster } from "@solana/web3.js";

export default class SolWeb3Service {

  static getWeb3(cluster: Cluster): Connection {
      return new Connection(clusterApiUrl(cluster), "confirmed")
  }
}
