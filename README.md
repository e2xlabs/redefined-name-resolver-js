# Usage

## Installation

```bash
npm i @redefined/name-resolver-js
```

or download the lib from NPM registry manually: [https://www.npmjs.com/package/@redefined/name-resolver-js](https://www.npmjs.com/package/@redefined/name-resolver-js)

## Full documentation
- [Gitbook](https://redefined.gitbook.io/connect/)

## Usage

```typescript
// initialize resolver
const resolver = new RedefinedResolver();

// resolve redefined names
const emailResult = await resolver.resolve("ik@e2xlabs.com");
/* {
    response: [
        {
            address: "0x6BdfC9Fb0102ddEFc2C7eb44cf62e96356D55d04",
            network: "evm",
            from: "redefined-email"
        }, {
            address: "0x6BdfC9Fb0102ddEFc2C7eb44cf62e96356D55d04",
            network: "bsc",
            from: "redefined-email"
        }
    ],
    errors: [
        {
            vendor: "ens",
            error: "Invalid domain",
        },
    ],
}*/
const nicknameResult = await resolver.resolve("gigachadivan");
/* {
    response: [{
        address: "GsYPSWAbXw4YsSEeowuTf7nqjExVxKS5tS1Yy9WwFAPG",
        network: "sol",
        from: "redefined-username"
    }],
    errors: [],
}*/

// resolve ENS names
const ensResult = await resolver.resolve("ivan.eth");
/* {
    response: [{
        address: "0x25428d29a6FA3629ff401c6DADe418B19CB2D615",
        network: "evm",
        from: "ens"
    }],
    errors: [
        {
            vendor: "redefiend-email",
            error: "Domain is not registered",
        },
    ],
}*/

// resolve Unstoppable names
const unstoppableResult = await resolver.resolve("nick.crypto");
/* {
    response: [{
        address: "0x16d94b922bF11981DBa2C4A6cAEd9938F00d5d0C",
        network: "evm",
        from: "unstoppable"
    }],
    errors: [],
}*/

// resolve specific network
const ethResult = await resolver.resolve("ik@e2xlabs.com", ["eth"]);
/* {
    response: [{
        address: "0x6BdfC9Fb0102ddEFc2C7eb44cf62e96356D55d04",
        network: "eth",
        from: "redefined-email"
    }],
    errors: [],
}*/
const bscFromUnstoppable = await resolver.resolve("nick.crypto", ["bsc"]);
/* {
    response: [{
        address: "0x16d94b922bF11981DBa2C4A6cAEd9938F00d5d0C",
        network: "evm",
        from: "unstoppable"
    }],
    errors: [],
}*/
```

## Priorties of resolution of EVM-compatible

For example, you want to get a BSC or Polygon address, but there is no special mapping for them, we will fall back to default EVM mapping.

1. If we do not find the address in the desired network, but find EVM, then we will give you EVM
2. If we find the address in the desired network + EVM, then we will give you only the address in the desired network
3. If desired network is not specified, we will return all known results

```typescript
resolve.resolve("domain", ["eth"]);
// We found [{ address: "0x", network: "eth", from:"redefined" }, { address: "0x", network: "evm", from:"redefined" }]
// You receive [{ address: "0x", network: "eth", from:"redefined" }]

resolve.resolve("domain", ["eth"]);
// We found [{ address: "0x", network: "bsc", from:"redefined" }, { address: "0x", network: "evm", from:"redefined" }]
// You receive [{ address: "0x", network: "evm, from:"redefined" }]

resolve.resolve("domain");
// We found [{ address: "0x", network: "bsc", from:"redefined" }, { address: "0x", network: "evm", from:"redefined" }]
// You receive [{ address: "0x", network: "bsc, from:"redefined" }, { address: "0x", network: "evm", from:"redefined" }]
```

## Recommended config for Production use

Each supported domain system is hosted on some blockhain, and lib needs corresponding JSON RPC nodes in order to resolve names.

Our lib comes with all necessary node URLs built-in, but we strongly recommend specifying your own JSON RPC node URLs in order to provide best availability of service.&#x20;

Please follow [set-your-own-node-urls.md](set-your-own-node-urls.md "mention") documentation.

# Set your own Node URLs

We recommend you to use your own JSON RPC URLs, especially for production: this will improve availability of service and will lower the load on our public nodes.

## Pass node URLs on init

```typescript
const options: ResolversParams = {
  redefined: {
      node: "https://evm.node.io/123abc",
  },
  unstoppable: {
      mainnetNode: "https://evm2.node.io/123abc",
      polygonMainnetNode: "https://evm-polygon.node.io/123abc",
  },
  ens: {
    node: "https://evm.node.io/123abc",
  },
}

const resolver = new RedefinedResolver({
      resolvers: RedefinedResolver.createDefaultResolvers(options)
});
```

# Add your own Custom Resolver

You can implement your own resolver service and add pass it to `RedefinedResolver`.

## Step 1. Extend ResolverService class

Please see github for sources: [https://github.com/e2xlabs/redefined-name-resolver-js/blob/master/src/services/resolvers/resolver.service.ts](https://github.com/e2xlabs/redefined-name-resolver-js/blob/master/src/services/resolvers/resolver.service.ts)

```typescript
export abstract class ResolverService {
    abstract vendor: ResolverVendor;
    abstract resolve(domain: string, networks?: string[], options?: CustomResolverServiceOptions): Promise<Account[]>;
}
```

Example:

```typescript
export class KeyValueResolverService extends ResolverService {

    vendor: ResolverVendor = "keyvalue"
    
    registry = {
        "ivan": "0x1",
        "stepan": "0x2",
        "andrey": "0x3",
    }

    async resolve(domain: string): Promise<Account[]> {
        const address = registry[domain];
        
        if (!address) throw Error("Domain is not registered")
        
        return [{ address, network: "evm", from: this.vendor }];
    }
}
```

## Step 2. Register your ResolverService in RedefinedResolver

Initialize `RedefinedResolver` with your `ResolverService` only:

```typescript
const resolver = new RedefinedResolver({
      resolvers: [new KeyValueResolverService()]
});
```

Or combine it with existing built-in resolver services:

```typescript
const resolver = new RedefinedResolver({
      resolvers: [
            ...RedefinedResolver.createDefaultResolvers(),
            new KeyValueResolverService(),
      ]
});
```

## Contribute!

Open a pull request with your new `ResolverService` in our [GitHub](https://github.com/e2xlabs/redefined-name-resolver-js) and help the community!

# Customization

## Reference

```typescript
export type EnsParams = { node: string };
export type UnstoppableParams = { mainnetNode?: string, polygonMainnetNode?: string };
export type RedefinedParams = { node?: string, allowDefaultEvmResolves?: boolean };

export type ResolversParams = {
    redefined?: RedefinedParams,
    unstoppable?: UnstoppableParams,
    ens?: EnsParams,
}
```

## Set you own Nodes

Documented [here.](set-your-own-node-urls.md)

## Init with params

```typescript
const resolver = new RedefinedResolver({
      resolvers: RedefinedResolver.createDefaultResolvers({
        // specify only params that you want to change
        redefined: {
          node: "https://evm.node.io/123",
          allowDefaultEvmResolves: false
        },
        // uncomment if you want to specify params for ens, otherwise defaults used
        // ens: { node: "https://evm.node.io/123abc" }
      })
});
```
