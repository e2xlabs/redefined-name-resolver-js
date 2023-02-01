import Web3 from "web3";
import { networks } from "@/networks";
import { Network } from "@/models/types";

export default class EvmWeb3Service {

    static getWeb3(network: Network): Web3 {
        if (network !== Network.ETH && network !== Network.BSC) throw Error(`${network} not supported for evm web3`);

        return new Web3(new Web3.providers.HttpProvider(networks[network].config.url));
    }
}
