import SolWeb3Service from "@resolver/services/web3/sol-web3.service";
import config from "@resolver/config";

describe('sol-web3.service', () => {
  test('SHOULD get web3 provider', () => {
    expect(SolWeb3Service.getWeb3(config.SOL_NODE)).not.toBe(undefined);
  });
});
