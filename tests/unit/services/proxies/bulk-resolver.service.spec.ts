import { BulkProxy } from "@resolver/services/proxies/bulk-resolver.service";
import config from "@resolver/config";
import { mockConfigResolvers } from "../../../test-fixtures/config-resolvers-response";
import { EnsParams } from "@resolver/models/types";
import { EnsResolverService } from "@resolver/services/resolvers/ens-resolver.service";

const mockResolveResult = jest.fn();

jest.mock("@resolver/services/resolvers/ens-resolver.service", () => {
    return {
        EnsResolverService: jest.fn().mockImplementation(() => {
            return {
                vendor: "ens",
                resolve: (domain: string) => mockResolveResult()
            }
        }),
    };
});

describe('bulk-resolver.service', () => {

    beforeEach(() => {
        mockResolveResult.mockClear();
    })

    test('SHOULD set resolver vendor IF create proxy resolver', async () => {
        const instanceRef = (conf: EnsParams | undefined) => new EnsResolverService(conf?.node || config.ENS_NODE);

        const proxy = new BulkProxy(undefined, instanceRef);

        expect(proxy.vendor).toEqual("ens");
    });

    test('SHOULD create only 1 instance with default config IF create proxy with undefined config', async () => {
        const instanceRef = (conf: EnsParams | undefined) => new EnsResolverService(conf?.node || config.ENS_NODE);

        new BulkProxy(undefined, instanceRef);

        expect(EnsResolverService).toHaveBeenCalledTimes(1);
        expect(EnsResolverService).toHaveBeenCalledWith(config.ENS_NODE);
    });

    test('SHOULD create 3 instances + 1 default instance IF create proxy with 3 config params', async () => {
        const mockConfig = mockConfigResolvers;
        const instanceRef = (conf: EnsParams | undefined) => new EnsResolverService(conf?.node || config.ENS_NODE);

        new BulkProxy<EnsParams | undefined, EnsResolverService>(mockConfig.ens, instanceRef);

        expect(EnsResolverService).toHaveBeenCalledTimes(4);
        expect(EnsResolverService).toHaveBeenCalledWith(mockConfig.ens[0].node);
        expect(EnsResolverService).toHaveBeenCalledWith(mockConfig.ens[1].node);
        expect(EnsResolverService).toHaveBeenCalledWith(mockConfig.ens[2].node);
        expect(EnsResolverService).toHaveBeenCalledWith(config.ENS_NODE);
    });

    test('SHOULD return resolve result IF resolver worked successfully', async () => {
        mockResolveResult.mockResolvedValueOnce([{address: "0x123", network: "eth", from: "ens"}]);
        const mockConfig = mockConfigResolvers;
        const instanceRef = (conf: EnsParams | undefined) => new EnsResolverService(conf?.node || config.ENS_NODE);

        const proxy = new BulkProxy<EnsParams | undefined, EnsResolverService>(mockConfig.ens, instanceRef);

        expect(EnsResolverService).toHaveBeenCalledTimes(4);
        expect(await proxy.resolve("domain")).toEqual([{address: "0x123", network: "eth", from: "ens"}])
    });

    test('SHOULD throw exception IF all resolvers NOT worked successfully', async () => {
        mockResolveResult.mockRejectedValue(new Error("some error"));
        const mockConfig = mockConfigResolvers;
        const instanceRef = (conf: EnsParams | undefined) => new EnsResolverService(conf?.node || config.ENS_NODE);

        const proxy = new BulkProxy<EnsParams | undefined, EnsResolverService>(mockConfig.ens, instanceRef);

        expect(EnsResolverService).toHaveBeenCalledTimes(4);
        expect(proxy.resolve("domain")).rejects.toThrow("some error")
    });

    test('SHOULD throw last exception IF all resolvers NOT worked successfully', async () => {
        mockResolveResult.mockRejectedValueOnce(new Error("1 error"));
        mockResolveResult.mockRejectedValueOnce(new Error("2 error"));
        mockResolveResult.mockRejectedValueOnce(new Error("3 error"));
        mockResolveResult.mockRejectedValueOnce(new Error("4 error"));
        mockResolveResult.mockResolvedValueOnce([{address: "0x123", network: "eth", from: "ens"}]);
        const mockConfig = mockConfigResolvers;
        const instanceRef = (conf: EnsParams | undefined) => new EnsResolverService(conf?.node || config.ENS_NODE);

        const proxy = new BulkProxy<EnsParams | undefined, EnsResolverService>(mockConfig.ens, instanceRef);

        expect(EnsResolverService).toHaveBeenCalledTimes(4);
        expect(proxy.resolve("domain")).rejects.toThrow("4 error")
    });

    test('SHOULD return resolve result IF last resolver successfully worked', async () => {
        mockResolveResult.mockRejectedValueOnce(new Error("1 error"));
        mockResolveResult.mockRejectedValueOnce(new Error("2 error"));
        mockResolveResult.mockRejectedValueOnce(new Error("3 error"));
        mockResolveResult.mockResolvedValueOnce([{address: "0x123", network: "eth", from: "ens"}]);
        const mockConfig = mockConfigResolvers;
        const instanceRef = (conf: EnsParams | undefined) => new EnsResolverService(conf?.node || config.ENS_NODE);

        const proxy = new BulkProxy<EnsParams | undefined, EnsResolverService>(mockConfig.ens, instanceRef);

        expect(EnsResolverService).toHaveBeenCalledTimes(4);
        expect(await proxy.resolve("domain")).toEqual([{address: "0x123", network: "eth", from: "ens"}])
    });
});
