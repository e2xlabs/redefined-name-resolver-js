import { Connection, PublicKey } from "@solana/web3.js";

export default class SolWeb3Service {

    static getWeb3(cluster: string): Connection {
        return new Connection(cluster)
    }

    static isValidAddress(address) {
        try {
            const publicKey = new PublicKey(address);
            return true;
        } catch (error) {
            return false;
        }
    }
}
