import { abi, chainPriceFeedMap } from "@/constants/build_pricefeed";
import { ethers } from "ethers";

export const getPriceFeedResponse = async () => {
    const rpcUrl = import.meta.env.VITE_ARBITRUM_SEPOLIA_RPC_URL;
    const provider = new ethers.JsonRpcProvider(rpcUrl);

    try {
        const { chainId } = await provider.getNetwork();
        const priceFeed = new ethers.Contract(chainPriceFeedMap[Number(chainId)], abi, provider);
        // prettier-ignore
        const priceFeedLatestResponse = (await priceFeed.getFunction("latestRoundData").staticCall()) as bigint[];
        return priceFeedLatestResponse;
    } catch (error) {
        console.log(error);
    }
};
