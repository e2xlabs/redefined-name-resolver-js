import EvmWeb3Service from "@resolver/services/web3/evm-web3.service";
import type { Account, Network, RedefinedReverse, AccountRecord } from "@resolver/models/types";

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
              register(domainHash: string, redefinedSign: string, records: AccountRecord[], newReverse: RedefinedReverse) { return []; },
              update(domainHash: string, records: Account[]) { return []; },
          }
      }
    }
  }),
);
