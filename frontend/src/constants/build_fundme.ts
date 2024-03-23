export const abi = [
    {
        inputs: [{ internalType: "address", name: "priceFeed", type: "address" }],
        stateMutability: "nonpayable",
        type: "constructor"
    },
    { inputs: [], name: "FundMe__DonationTooSmall", type: "error" },
    { inputs: [], name: "FundMe__NotOwner", type: "error" },
    { inputs: [], name: "FundMe__NothingToWithdraw", type: "error" },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "address", name: "sender", type: "address" },
            { indexed: false, internalType: "uint256", name: "amount", type: "uint256" }
        ],
        name: "Fund",
        type: "event"
    },
    {
        anonymous: false,
        inputs: [{ indexed: true, internalType: "uint256", name: "amount", type: "uint256" }],
        name: "Withdraw",
        type: "event"
    },
    { inputs: [], name: "fund", outputs: [], stateMutability: "payable", type: "function" },
    {
        inputs: [{ internalType: "address", name: "fundingAddress", type: "address" }],
        name: "getAddressToAmountFunded",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [{ internalType: "uint256", name: "index", type: "uint256" }],
        name: "getFunder",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [],
        name: "getOwner",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [],
        name: "getPriceFeed",
        outputs: [{ internalType: "contract AggregatorV3Interface", name: "", type: "address" }],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [],
        name: "getVersion",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function"
    },
    { inputs: [], name: "withdraw", outputs: [], stateMutability: "nonpayable", type: "function" },
    { stateMutability: "payable", type: "receive" }
];

interface ChainContractMap {
    [key: number]: `0x${string}`;
}

export const chainContractMap: ChainContractMap = {
    421614: "0xab273f19eA0746F601e325C7537677A914D04698"
};

export const supportedChains = [421614];
