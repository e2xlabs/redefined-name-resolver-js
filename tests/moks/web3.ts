import EvmWeb3Service from "@resolver/services/web3/evm-web3.service";
import type { AccountRecord, Network } from "@resolver/models/types";

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
              resolve(domain: string) {
                  return {
                      async call(): Promise<AccountRecord[]> {
                          return [
                              { addr: "0x123", network: "eth" },
                              { addr: "0x323", network: "sol" }
                          ];
                      },
                  }
              }
          }
      }
    }
  }),
);
