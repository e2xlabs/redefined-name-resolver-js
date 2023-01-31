import { ResolverService } from "@/services/resolvers/resolver.service";
import EvmWeb3Service from "@/services/web3/evm-web3.service";
import { Chain, SetAddressOptions } from "@/models/types";

const web3 = EvmWeb3Service.getWeb3(Chain.ETH);

export class EncResolverService implements ResolverService {
    // async resolver(alias: string) {
    //    return  web3.eth.ens.resolver(alias).then(function (contract) {
    //         console.log("resolver", contract);
    //         return contract;
    //     });
    // }

    async getAddresses(alias: string): Promise<string[]> {
        return web3.eth.ens.getAddress(alias).then(function (address) {
            console.log("getAddress", address);
            return [address];
        })
    }

    async setAddress(alias: string, address: string, options: SetAddressOptions) {
        return web3.eth.ens.setAddress(alias, address, options)
            .on('confirmation', function (confirmationNumber, receipt) {
                console.log("setAddress confirmation", { confirmationNumber, receipt });
                return { confirmationNumber, receipt };
            })
            .on('error', (e) => {
                throw Error(e.message)
            });
    }
}
