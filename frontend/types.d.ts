interface FundEvents {
    id: string;
    amount: string;
    blockTimestamp: string;
    sender: string;
    transactionHash: string;
    __typename: string;
}

interface ProcessedFundEvents extends FundEvents {
    usdBalance: string;
}

interface ProcessedData {
    eventsData: ProcessedFundEvents[];
    qtyUniqueDonors: number;
    totalEthDonated: string;
    totalDonationsInUsd: string;
}
