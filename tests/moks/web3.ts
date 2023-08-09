import EvmWeb3Service from "@resolver/services/web3/evm-web3.service";
import type { AccountRecord, RedefinedReverseResponse } from "@resolver/models/types";
import { BN } from "ethereumjs-util";

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
          reverse() {
            return {
              async call(): Promise<RedefinedReverseResponse> {
                return [new BN(1000), "[\"example\", \"username\"]"]
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
