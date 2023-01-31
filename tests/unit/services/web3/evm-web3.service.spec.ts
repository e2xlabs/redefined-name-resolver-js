import EvmWeb3Service from "@/services/web3/evm-web3.service";
import { Chain } from "@/models/types";

describe('evm-web3.service', () => {
  test('SHOULD get web3 provider', () => {
    expect(EvmWeb3Service.getWeb3(Chain.ETH)).not.toBe(undefined);
  });
});
