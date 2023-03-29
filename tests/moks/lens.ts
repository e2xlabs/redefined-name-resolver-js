// @ts-ignore
import "@apollo/client/core";

export const lensQuery = jest.fn()

jest.mock("@apollo/client/core", () => ({
    __esModule: true,
    default: {},
    ...jest.requireActual("@apollo/client/core"),
    ApolloClient: class ApolloClient {
        constructor(settings: any) {}
        query() {
            return lensQuery()
        }
    }
}));