import axios from "axios";
import type { CryptoCurrency, FiatCurrency } from "@resolver/models/types";

export class QuoteService {
    static async getEquiv(form: CryptoCurrency, to: FiatCurrency): Promise<number>{
        try {
            const { data } = await axios.get(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${form}&tsyms=${to}`);
            console.log(data);
            return data.RAW.ETH.USD.PRICE;
        } catch (e: any) {
            throw Error(e.message);
        }
    }
}
