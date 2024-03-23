import { useLoaderData } from "react-router-dom";
import { getEventsData } from "@/api/getEventsData";
import { DataTable } from "@/components/tables/data-table";
import { columns } from "@/components/tables/columns";
import SEO from "@/components/SEO";

export async function loader() {
    return await getEventsData("1000");
}

const Donations = () => {
    const data = useLoaderData() as ProcessedData;

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
                <DataTable
                    columns={columns}
                    data={data.eventsData}
                    borderColor="border-gray-500"
                    bgColor="bg-transparent"
                    pagination={true}
                    filtering={true}
                />
            </main>
        </>
    );
};

export default Donations;
