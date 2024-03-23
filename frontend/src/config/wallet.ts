import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";

// 1. Get projectId
const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;
const rpcUrl = import.meta.env.VITE_ARBITRUM_SEPOLIA_RPC_URL;

if (!projectId || !rpcUrl) throw new Error("Project Id required and RPC url are required");

// 2. Set chains
const arbitrumSepolia = {
    chainId: 421614,
    name: "Arbitrum Sepolia",
    currency: "ETH",
    explorerUrl: "https://sepolia.arbiscan.io",
    rpcUrl
};

// 3. Create a metadata object
const metadata = {
    name: "My Website",
    description: "My Website description",
    url: "https://mywebsite.com", // origin must match your domain & subdomain
    icons: ["https://avatars.mywebsite.com/"]
};

// 4. Create Ethers config
const ethersConfig = defaultConfig({
    /*Required*/
    metadata,

    /*Optional*/
    enableEIP6963: true, // true by default
    enableInjected: true, // true by default
    enableCoinbase: true // true by default
});

// 5. Create a Web3Modal instance
createWeb3Modal({
    ethersConfig,
    chains: [arbitrumSepolia],
    projectId
});
