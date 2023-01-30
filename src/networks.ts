import { Chain as ChainKey } from "@/models/types";

export type Chain = {
  config: any
  derivationPathRoot: string,
  chainId: string | undefined
}

export const networks: { [key in keyof typeof ChainKey]: Chain; } = {
  ETH: {
    config: {
      url: "https://mainnet.infura.io/v3/3d11b13de76d49bb92533d4843e35383"
    },
    derivationPathRoot: "m/44'/60'",
    chainId: "0x1",
  },
  SOL: {
    config: {
      cluster: "mainnet-beta"
    },
    derivationPathRoot: "m/44'/501'",
    chainId: undefined,
  },
  BSC: {
    config: {
      url: 'https://bsc-dataseed.binance.org',
      chainID: '0x38',
    },
    derivationPathRoot: "m/44'/60'",
    chainId: "0x38",
  }
};
