import axios from "axios";
import type { CryptoCurrency, FiatCurrency } from "@resolver/models/types";

export class QuoteService {
    static async getEquiv(form: FiatCurrency, to: CryptoCurrency): Promise<{ [key in CryptoCurrency]: number }>{
        try {
            const { data } = await axios.get(`https://min-api.cryptocompare.com/data/price?fsym=${form}&tsyms=${to}`);
            return data;
        } catch (e: any) {
            throw Error(e.message);
        }
    }
}
