import EvmWeb3Service from "@/services/web3/evm-web3.service";
import { Network } from "@/models/types";

describe('evm-web3.service', () => {
  test('SHOULD get web3 provider', () => {
    expect(EvmWeb3Service.getWeb3(Network.ETH)).not.toBe(undefined);
  });
});
