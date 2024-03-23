export function getTotalDonations(data: FundEvents[]) {
    const totalDonations = data.reduce((acc, event) => acc + BigInt(event.amount), 0n);
    return totalDonations;
}
