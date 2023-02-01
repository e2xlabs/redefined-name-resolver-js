import SolWeb3Service from "@/services/web3/sol-web3.service";

describe('sol-web3.service', () => {
  test('SHOULD get web3 provider', () => {
    expect(SolWeb3Service.getWeb3("sol")).not.toBe(undefined);
  });
});
