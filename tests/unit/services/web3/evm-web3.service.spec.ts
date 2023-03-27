import EvmWeb3Service from "@resolver/services/web3/evm-web3.service";
import config from "@resolver/config";

describe('evm-web3.service', () => {
  test('SHOULD get web3 provider', () => {
    const web3 = EvmWeb3Service.getWeb3(config.REDEFINED_NODE);
    expect(web3).not.toBe(undefined);
    expect(web3.eth).not.toBe(undefined);
    expect(web3.eth.Contract).not.toBe(undefined);
  });
  
  test('SHOULD get web3 http provider', () => {
    const web3 = EvmWeb3Service.getWeb3Http(config.REDEFINED_NODE);
    expect(web3).not.toBe(undefined);
    expect(web3.host).not.toBe(undefined);
  });
});
