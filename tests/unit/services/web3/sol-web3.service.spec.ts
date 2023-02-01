import SolWeb3Service from "@/services/web3/sol-web3.service";
import { Network } from "@/models/types";

describe('sol-web3.service', () => {
  test('SHOULD get web3 provider', () => {
    expect(SolWeb3Service.getWeb3(Network.SOL)).not.toBe(undefined);
  });
});
