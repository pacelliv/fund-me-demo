import React, { Suspense, useState } from "react";
import { useLoaderData, defer, Await } from "react-router-dom";
import { getEventsData } from "@/api/getEventsData";
import { DataTable } from "@/components/tables/data-table";
import { columns } from "@/components/tables/columns";
import { ethers } from "ethers";
import { chainContractMap, abi, supportedChains } from "@/constants/build_fundme";
import { useWeb3ModalProvider, useWeb3ModalAccount } from "@web3modal/ethers/react";
import { handleZodValidation, ValidationError } from "@/lib/handleZodValidation";
import { Skeleton } from "@/components/ui/skeleton";
import BigNumber from "bignumber.js";
import SkeletonCard from "@/components/SkeletonCard";
import SEO from "@/components/SEO";
import z from "zod";

const FormSchema = z.object({
    amount: z.custom(
        (value: unknown) => {
            if (typeof value !== "string")
                throw new Error("Invalid input type. Expected a string.");

            // 1. check if the string includes a dot, this indicates the value includes decimals
            // 2. then split the value using the dot as the separator to create an array with
            // the substrings (integer, decimals) as the elements
            // 3. fetch the element at index 1 (decimals) and get the length
            // 4. coerce to number
            const decimalsCount = value.includes(".") ? Number(value.split(".")[1].length) : 0;
            const bigNumber = new BigNumber(value);
            if (bigNumber.isFinite() && decimalsCount <= 18) return bigNumber;
        },
        { message: "Invalid amount" }
    )
});

export async function loader() {
    return defer({ eventsData: getEventsData("1000") });
}

const Home = () => {
    const { walletProvider } = useWeb3ModalProvider();
    const { isConnected } = useWeb3ModalAccount();
    const [errors, setErrors] = useState<ValidationError<typeof FormSchema>>({});
    const data = useLoaderData() as Awaited<Promise<ProcessedData>>;

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            if (typeof walletProvider !== "undefined") {
                const data = Object.fromEntries(new FormData(e.currentTarget));

                handleZodValidation({
                    data: data,
                    schema: FormSchema,
                    // onSuccess: async res => await fundContract(res.amount),
                    onSuccess: async res => {},
                    onError: setErrors
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function fundContract(amount: string) {
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

    function renderTotalEthDonated(data: ProcessedData) {
        return (
            <>
                <p className="text-2xl font-bold leading-normal text-white">
                    {data.totalEthDonated} ETH
                </p>
                <p className="text-lg font-normal">received as donations</p>
            </>
        );
    }

    function renderTotalDonationsInUsd(data: ProcessedData) {
        return (
            <>
                <p className="text-2xl font-bold leading-normal text-white">
                    {data.totalDonationsInUsd}
                </p>
                <p className="text-lg font-normal">received in usd</p>
            </>
        );
    }

    function renderTotalDonations(data: ProcessedData) {
        return (
            <>
                <p className="text-2xl font-bold leading-normal text-white">
                    {data.eventsData.length}
                </p>
                <p className="text-lg font-normal">total donations</p>
            </>
        );
    }

    function renderUniqueDonors(data: ProcessedData) {
        return (
            <>
                <p className="text-2xl font-bold leading-normal text-white">
                    {data.qtyUniqueDonors}
                </p>
                <p className="text-lg font-normal">unique donors</p>
            </>
        );
    }

    function renderTable(data: ProcessedData) {
        return (
            <DataTable
                columns={columns}
                data={data.eventsData}
                borderColor="border-[#ecebf069]"
                bgColor="bg-[#715db969]"
                pagination={false}
                filtering={false}
            />
        );
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
                        You can help me to build cool stuff.
                    </h1>
                    <p className="mb-3 text-lg font-medium leading-relaxed">
                        With your donation I can build smart contracts, React apps, servers,
                        libraries, DevOp tools and a lot more. Help me BUILD.
                    </p>
                    <em className="mb-5 block text-lg font-medium leading-relaxed">
                        This is a sample project, it uses fake money.
                    </em>
                    <form method="post" onSubmit={handleSubmit}>
                        {errors["amount"] && (
                            <p className="mb-1 text-sm text-red-500">{errors["amount"]}</p>
                        )}
                        <input
                            autoComplete="off"
                            name="amount"
                            required
                            type="number"
                            step="0.000000000000000001"
                            aria-label="Ether amount to donate"
                            placeholder="1.00"
                            className="mb-2 block w-full rounded border-2 border-[#463dff] bg-[#0c0b0e] px-3 py-2 font-medium text-[#fff]"
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
                        <Suspense fallback={<Skeleton className="h-[50px] w-10/12" />}>
                            <Await resolve={data.eventsData}>{renderTotalEthDonated}</Await>
                        </Suspense>
                    </div>
                    <div className="m-0 flex h-full w-full flex-col items-center justify-center bg-[#1d1b26] p-6 text-center min-[960px]:p-8">
                        <Suspense fallback={<Skeleton className="h-[50px] w-10/12" />}>
                            <Await resolve={data.eventsData}>{renderTotalDonationsInUsd}</Await>
                        </Suspense>
                    </div>
                    <div className="m-0 flex h-full w-full flex-col items-center justify-center bg-[#1d1b26] p-6 text-center min-[960px]:p-8">
                        <Suspense fallback={<Skeleton className="h-[50px] w-10/12" />}>
                            <Await resolve={data.eventsData}>{renderTotalDonations}</Await>
                        </Suspense>
                    </div>
                    <div className="m-0 flex h-full w-full flex-col items-center justify-center bg-[#1d1b26] p-6 text-center min-[960px]:p-8">
                        <Suspense fallback={<Skeleton className="h-[50px] w-10/12" />}>
                            <Await resolve={data.eventsData}>{renderUniqueDonors}</Await>
                        </Suspense>
                    </div>
                </section>
            </div>

            <section className="block bg-[#4d22c7]">
                <div className="mx-auto w-11/12 max-w-[1000px] pb-16 pt-12">
                    <h2 className="mb-6 text-2xl font-medium tracking-tight text-white">
                        Latest donations
                    </h2>
                    <Suspense fallback={<SkeletonCard />}>
                        <Await resolve={data.eventsData}>{renderTable}</Await>
                    </Suspense>
                </div>
            </section>
        </>
    );
};

export default Home;
