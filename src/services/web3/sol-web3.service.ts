import { Connection } from "@solana/web3.js";

export default class SolWeb3Service {

  static getWeb3(cluster: string): Connection {
      return new Connection(cluster)
  }
}
