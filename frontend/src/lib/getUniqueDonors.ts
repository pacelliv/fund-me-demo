export function getUniqueDonors(data: FundEvents[]) {
    const uniqueDonors = [...new Set(data.map(event => event.sender))];
    return uniqueDonors;
}
