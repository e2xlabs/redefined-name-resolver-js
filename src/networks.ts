import { Chain as ChainKey } from "@/models/types";
import { keyBy } from "lodash";

export type Chain = {
  config: any
  chainId: string | undefined
  chain: ChainKey,
}

export const networks = keyBy([
  {
    config: {
      url: "https://mainnet.infura.io/v3/3d11b13de76d49bb92533d4843e35383"
    },
    chainId: "0x1",
    chain: ChainKey.ETH,
  },
  {
    config: {
      cluster: "mainnet-beta"
    },
    chainId: undefined,
    chain: ChainKey.SOL
  },
  {
    config: {
      url: 'https://bsc-dataseed.binance.org',
      chainID: '0x38',
    },
    chainId: "0x38",
    chain: ChainKey.BSC
  }
], "chain");
