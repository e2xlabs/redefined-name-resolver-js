import SolWeb3Service from "@resolver/services/web3/sol-web3.service";

describe('sol-web3.service', () => {
  test('SHOULD get web3 provider', () => {
    const web3 = SolWeb3Service.getWeb3("mainnet-beta");
    expect(web3).not.toBe(undefined);
  });
});
