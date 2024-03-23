import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { getPriceFeedResponse } from "./getPriceFeedResponse";
import { ethers } from "ethers";
import { getUniqueDonors } from "@/lib/getUniqueDonors";
import { getTotalDonations } from "@/lib/getTotalDonations";
import { getUsdValue } from "@/lib/getUsdValue";

const SUB_GRAPH_URL = "https://api.studio.thegraph.com/query/46610/fundme-subgraph/version/latest";

const client = new ApolloClient({ uri: SUB_GRAPH_URL, cache: new InMemoryCache() });

export async function getEventsData(amount: string = "1000"): Promise<ProcessedData | undefined> {
    const fundEventsQuery = `
        query {
            funds(first: ${amount}, orderBy: blockTimestamp, orderDirection: desc) {
                id
                sender
                amount
                blockTimestamp
                transactionHash
            }
        }
    `;

    try {
        const response = (await getPriceFeedResponse()) as bigint[];
        const normalizedPrice = response[1] * 10n ** 10n;
        const data = await client.query({ query: gql(fundEventsQuery) });
        const uniqueDonors = getUniqueDonors(data.data.funds as FundEvents[]);
        const totalDonations = getTotalDonations(data.data.funds as FundEvents[]);
        const totalDonatedInUsd = getUsdValue(totalDonations, normalizedPrice);

        const processedEvents: ProcessedFundEvents[] = data.data.funds.map((event: FundEvents) => {
            const usdValue = getUsdValue(BigInt(event.amount), normalizedPrice);
            return { ...event, usdBalance: usdValue };
        });

        return {
            eventsData: processedEvents,
            qtyUniqueDonors: uniqueDonors.length,
            totalEthDonated: ethers.formatUnits(totalDonations.toString(), "ether"),
            totalDonationsInUsd: totalDonatedInUsd
        };
    } catch (error) {
        console.log(error);
    }
}
