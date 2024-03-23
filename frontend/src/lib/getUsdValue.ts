import { ethers } from "ethers";

const USDDollar = new Intl.NumberFormat("en-US", {
    currency: "USD",
    style: "currency"
});

export function getUsdValue(amount: bigint, price: bigint) {
    const donationValueIsUsd = (price * amount) / 10n ** 18n;
    return USDDollar.format(Number(ethers.formatUnits(donationValueIsUsd, "ether")));
}
