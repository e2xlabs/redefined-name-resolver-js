import { Network } from "@/models/types";
import { keyBy } from "lodash";

export type Chain = {
  config: any
  chainId: string | undefined
  network: Network,
}

const chains: Chain[] = [
  {
    config: {
      url: "https://mainnet.infura.io/v3/3d11b13de76d49bb92533d4843e35383"
    },
    chainId: "0x1",
    network: "eth",
  },
  {
    config: {
      cluster: "mainnet-beta"
    },
    chainId: undefined,
    network: "sol"
  },
  {
    config: {
      url: 'https://bsc-dataseed.binance.org',
      chainID: '0x38',
    },
    chainId: "0x38",
    network: "bsc"
  }
];

export const networks = keyBy(chains, "network");
