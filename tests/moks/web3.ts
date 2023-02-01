import EvmWeb3Service from "@/services/web3/evm-web3.service";
import SolWeb3Service from "@/services/web3/sol-web3.service";
import { Network } from "@/models/types";

EvmWeb3Service.getWeb3 = jest.fn().mockImplementation(
  (network: Network) => ({
    eth: {
      ens: {
        async getAddress(domain: string): Promise<string> {
          return "0x123"
        }
      },
      Contract: class Contract {
          methods = {
              resolve(domain: string) { return []; },
              register(domain: string) { return []; },
              update(domain: string) { return []; },
          }
      }
    }
  }),
);
SolWeb3Service.getWeb3 = jest.fn().mockImplementation(
  (network: Network) => ({ }),
);
