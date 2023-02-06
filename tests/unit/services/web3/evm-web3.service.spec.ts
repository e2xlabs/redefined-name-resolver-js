import EvmWeb3Service from "@resolver/services/web3/evm-web3.service";
import config from "@resolver/config";

describe('evm-web3.service', () => {
  test('SHOULD get web3 provider', () => {
    expect(EvmWeb3Service.getWeb3(config.ETH_NODE)).not.toBe(undefined);
  });
});
