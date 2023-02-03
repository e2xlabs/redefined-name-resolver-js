import EvmWeb3Service from "@/services/web3/evm-web3.service";
import SolWeb3Service from "@/services/web3/sol-web3.service";
import { Account, Network, RedefinedRevers } from "@/models/types";

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
              register(domainHash: string, redefinedSign: string, records: Account[], newRevers: RedefinedRevers[]) { return []; },
              update(domainHash: string, records: Account[]) { return []; },
          }
      }
    }
  }),
);
SolWeb3Service.getWeb3 = jest.fn().mockImplementation(
  (network: Network) => ({ }),
);
