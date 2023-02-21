import type { AbiItem } from "web3-utils";

export const redefinedNicknameResolverAbi: AbiItem[] = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "version",
        "type": "uint8"
      }
    ],
    "name": "Initialized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "key",
        "type": "string"
      },
      {
        "components": [
          {
            "internalType": "string",
            "name": "network",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "addr",
            "type": "address"
          }
        ],
        "indexed": false,
        "internalType": "struct NickNameService.Record[]",
        "name": "_records",
        "type": "tuple[]"
      }
    ],
    "name": "RegisterDomain",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "key",
        "type": "string"
      },
      {
        "components": [
          {
            "internalType": "string",
            "name": "network",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "addr",
            "type": "address"
          }
        ],
        "indexed": false,
        "internalType": "struct NickNameService.Record[]",
        "name": "_records",
        "type": "tuple[]"
      }
    ],
    "name": "UpdateDomain",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_key",
        "type": "string"
      }
    ],
    "name": "calcNicknamePrice",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "domainsCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getLatestPrice",
    "outputs": [
      {
        "internalType": "int256",
        "name": "",
        "type": "int256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_bnbUsdFeedAddr",
        "type": "address"
      },
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "length",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "price",
            "type": "uint256"
          }
        ],
        "internalType": "struct NickNameService.PriceEntry[]",
        "name": "_prices",
        "type": "tuple[]"
      }
    ],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_key",
        "type": "string"
      }
    ],
    "name": "isVirgin",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "pricesPerLengthInUsd",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_key",
        "type": "string"
      },
      {
        "components": [
          {
            "internalType": "string",
            "name": "network",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "addr",
            "type": "address"
          }
        ],
        "internalType": "struct NickNameService.Record[]",
        "name": "_records",
        "type": "tuple[]"
      },
      {
        "components": [
          {
            "internalType": "int256",
            "name": "version",
            "type": "int256"
          },
          {
            "internalType": "string",
            "name": "data",
            "type": "string"
          }
        ],
        "internalType": "struct NickNameService.Reverse",
        "name": "newReverse",
        "type": "tuple"
      }
    ],
    "name": "register",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_key",
        "type": "string"
      }
    ],
    "name": "resolve",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "network",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "addr",
            "type": "address"
          }
        ],
        "internalType": "struct NickNameService.Record[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "reverse",
    "outputs": [
      {
        "internalType": "int256",
        "name": "",
        "type": "int256"
      },
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_addr",
        "type": "address"
      }
    ],
    "name": "setBnbUsdAggregatorAddress",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "length",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "price",
            "type": "uint256"
          }
        ],
        "internalType": "struct NickNameService.PriceEntry[]",
        "name": "_prices",
        "type": "tuple[]"
      }
    ],
    "name": "setPricesPerLengthInUsd",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_key",
        "type": "string"
      },
      {
        "components": [
          {
            "internalType": "string",
            "name": "network",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "addr",
            "type": "address"
          }
        ],
        "internalType": "struct NickNameService.Record[]",
        "name": "_records",
        "type": "tuple[]"
      }
    ],
    "name": "update",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address payable",
        "name": "_target",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
];

export default redefinedNicknameResolverAbi;
