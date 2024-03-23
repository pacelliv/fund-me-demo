import { ColumnDef } from "@tanstack/react-table";
import { ethers } from "ethers";
import { ExternalLinkIcon } from "@radix-ui/react-icons";

export const columns: ColumnDef<ProcessedFundEvents>[] = [
    {
        accessorKey: "sender",
        header: () => <div className="p-2 text-white">Donor</div>,
        cell: ({ row }) => {
            const sender = row.getValue("sender") as string;
            return <div className="p-2">{sender}</div>;
        }
    },
    {
        accessorKey: "transactionHash",
        header: () => <div className="p-2 text-white">Tx Hash</div>,
        cell: ({ row }) => {
            const txHash = row.getValue("transactionHash") as string;
            return (
                <div className="p-2">
                    <a
                        className="flex items-center gap-x-2 hover:text-white/70"
                        href={`https://sepolia.arbiscan.io/tx/${txHash}`}
                    >
                        {txHash.slice(0, 10)}...{txHash.slice(-8)}
                        <ExternalLinkIcon />
                    </a>
                </div>
            );
        }
    },
    {
        accessorKey: "amount",
        header: () => <div className="p-2 text-white">Amount</div>,
        cell: ({ row }) => {
            return (
                <div className="min-w-max p-2">
                    {ethers.formatUnits(row.getValue("amount"), "ether")} ETH
                </div>
            );
        }
    },
    {
        accessorKey: "usdBalance",
        header: () => <div className="p-2 text-white">USD</div>,
        cell: ({ row }) => {
            return <div className="min-w-max p-2">{row.getValue("usdBalance")}</div>;
        }
    },
    {
        accessorKey: "blockTimestamp",
        header: () => <div className="p-2 text-white">Date</div>,
        cell: ({ row }) => {
            const timestamp = parseInt(row.getValue("blockTimestamp"));
            const formattedDate = new Date(timestamp * 1000);
            return <div className="min-w-max p-2">{formattedDate.toLocaleString()}</div>;
        }
    }
];
