import { Suspense } from "react";
import { useLoaderData, defer, Await } from "react-router-dom";
import { getEventsData } from "@/api/getEventsData";
import { DataTable } from "@/components/tables/data-table";
import { columns } from "@/components/tables/columns";
import SkeletonCard from "@/components/SkeletonCard";
import SEO from "@/components/SEO";

export async function loader() {
    return defer({ eventsData: getEventsData("1000") });
}

const Donations = () => {
    const data = useLoaderData() as Awaited<Promise<ProcessedData>>;

    function renderTable(data: ProcessedData) {
        return (
            <DataTable
                columns={columns}
                data={data.eventsData}
                borderColor="border-gray-500"
                bgColor="bg-transparent"
                pagination={true}
                filtering={true}
            />
        );
    }

    return (
        <>
            <SEO
                title="FundMe | Donations"
                description="Donations page. On this pages the users can see all the history donations to the contract. The data is displayed in a table."
            />
            <main className="mx-auto w-11/12 max-w-[1000px] pb-16">
                <h1 className="mb-8 w-4/5 text-4xl font-bold leading-snug text-white min-[750px]:w-72 min-[960px]:w-96 lg:text-5xl">
                    All Donations
                </h1>
                <Suspense fallback={<SkeletonCard />}>
                    <Await resolve={data.eventsData}>{renderTable}</Await>
                </Suspense>
            </main>
        </>
    );
};

export default Donations;
