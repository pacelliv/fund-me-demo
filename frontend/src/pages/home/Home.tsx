import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { getEventsData } from "@/api/getEventsData";
import { DataTable } from "@/components/tables/data-table";
import { columns } from "@/components/tables/columns";
import { ethers } from "ethers";
import { chainContractMap, abi, supportedChains } from "@/constants/build_fundme";
import { useWeb3ModalProvider, useWeb3ModalAccount } from "@web3modal/ethers/react";
import SEO from "@/components/SEO";

export async function loader() {
    return await getEventsData("12");
}

const Home = () => {
    const { walletProvider } = useWeb3ModalProvider();
    const { isConnected } = useWeb3ModalAccount();
    const [amount, setAmount] = useState("");
    const data = useLoaderData() as ProcessedData;

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            if (typeof walletProvider !== "undefined") {
                const provider = new ethers.BrowserProvider(walletProvider);
                const signer = await provider.getSigner();
                const contract = new ethers.Contract(
                    chainContractMap[supportedChains[0]],
                    abi,
                    signer
                );
                const txResponse = await contract
                    .getFunction("fund")
                    .send({ value: ethers.parseEther(amount) });
                const txReceipt = await txResponse.wait(1);
                console.log(txReceipt);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <SEO
                title="FundMe | Home"
                description="Application landing page, users can donate ether on this page"
            />
            <div className="mx-auto grid w-11/12 max-w-[1000px] grid-cols-[1fr] grid-rows-[auto] gap-6 pb-16 min-[750px]:grid-cols-[1fr,1fr]">
                <main>
                    <h1 className="mb-6 w-4/5 text-4xl font-bold leading-snug text-white min-[750px]:w-72 min-[960px]:w-96 lg:text-5xl">
                        With your donation you can help me to build cool stuff.
                    </h1>
                    <p className="mb-5 text-lg font-medium leading-relaxed">
                        With your donation I can build smart contracts, React apps, servers,
                        libraries, DevOp tools. Help me to BUILD, BUILD and BUILD.
                    </p>
                    <form method="post" onSubmit={handleSubmit}>
                        <input
                            autoComplete="off"
                            name="amount"
                            required
                            type="text"
                            aria-label="Ether amount to donate"
                            placeholder="1.00"
                            className="mb-2 block w-full rounded border-2 border-[#463dff] bg-[#0c0b0e] px-3 py-2 font-medium text-[#fff]"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                        />
                        <button
                            disabled={!isConnected}
                            className={`block w-full cursor-not-allowed rounded border-2 border-[#463dff] bg-[#463dff] px-6 py-2 font-medium text-white ${isConnected && "cursor-pointer bg-[#463dff] hover:border-[#372ede] hover:bg-[#372ede]"}`}
                        >
                            {isConnected ? "Make a donation" : "Connect wallet"}
                        </button>
                    </form>
                </main>
                <section className="mt-6 grid grid-cols-[repeat(1,1fr)] grid-rows-[repeat(4,1fr)] items-center justify-items-center gap-[2px] overflow-hidden rounded-lg min-[600px]:grid-cols-[repeat(2,1fr)] min-[600px]:grid-rows-[repeat(2,1fr)] min-[750px]:mt-0 min-[750px]:grid-cols-[repeat(1,1fr)] min-[750px]:grid-rows-[repeat(4,1fr)] min-[960px]:grid-cols-[repeat(2,1fr)] min-[960px]:grid-rows-[repeat(2,1fr)]">
                    <div className="m-0 flex h-full w-full flex-col items-center justify-center bg-[#1d1b26] p-6 text-center min-[960px]:p-8">
                        <p className="text-2xl font-bold leading-normal text-white">
                            {data.totalEthDonated} ETH
                        </p>
                        <p className="text-lg font-normal">received as donations</p>
                    </div>
                    <div className="m-0 flex h-full w-full flex-col items-center justify-center bg-[#1d1b26] p-6 text-center min-[960px]:p-8">
                        <p className="text-2xl font-bold leading-normal text-white">
                            {data.totalDonationsInUsd}
                        </p>
                        <p className="text-lg font-normal">donated in usd</p>
                    </div>
                    <div className="m-0 flex h-full w-full flex-col items-center justify-center bg-[#1d1b26] p-6 text-center min-[960px]:p-8">
                        <p className="text-2xl font-bold leading-normal text-white">
                            {data.eventsData.length}
                        </p>
                        <p className="text-lg font-normal">total donations</p>
                    </div>
                    <div className="m-0 flex h-full w-full flex-col items-center justify-center bg-[#1d1b26] p-6 text-center min-[960px]:p-8">
                        <p className="text-2xl font-bold leading-normal text-white">
                            {data.qtyUniqueDonors}
                        </p>
                        <p className="text-lg font-normal">unique donors</p>
                    </div>
                </section>
            </div>
            <section className="block bg-[#4d22c7]">
                <div className="mx-auto w-11/12 max-w-[1000px] pb-16 pt-12">
                    <h2 className="mb-6 text-2xl font-medium tracking-tight text-white">
                        Latest donations
                    </h2>
                    <DataTable
                        columns={columns}
                        data={data.eventsData}
                        borderColor="border-[#ecebf069]"
                        bgColor="bg-[#715db969]"
                        pagination={false}
                        filtering={false}
                    />
                </div>
            </section>
        </>
    );
};

export default Home;