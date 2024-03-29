import EvmWeb3Service from "@resolver/services/web3/evm-web3.service";
import type { AccountRecord, ReverseAccount } from "@resolver/models/types";

EvmWeb3Service.getWeb3 = jest.fn().mockImplementation(
  (node: string) => ({
    eth: {
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
          },
          fetchBindedDomainsToAddress(address: string) {
            return {
              async call(): Promise<ReverseAccount[]> {
                return [
                  {
                    domain: "example",
                    from: "redefined-username"
                  },
                  {
                    domain: "username",
                    from: "redefined-username"
                  }
                ]
              },
            }
          }
        }
      }
    }
  }),
);

EvmWeb3Service.getWeb3Http = jest.fn().mockImplementation(
  (node: string) => ({
    host: node,
  }),
);
