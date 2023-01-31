import EvmWeb3Service from "../../../services/web3/evm-web3.service";
import SolWeb3Service from "../../../services/web3/sol-web3.service";
import { Chain } from "../../../models/types";

EvmWeb3Service.getWeb3 = jest.fn().mockImplementation(
  (chain: Chain) => ({ }),
);
SolWeb3Service.getWeb3 = jest.fn().mockImplementation(
  (chain: Chain) => ({ }),
);
