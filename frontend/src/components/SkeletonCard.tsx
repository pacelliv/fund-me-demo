import { Skeleton } from "@/components/ui/skeleton";

const SkeletonCard = () => {
    return (
        <div className="flex flex-col items-center space-y-3">
            <Skeleton className="h-[200px] w-9/12 rounded-xl md:w-5/12" />
            <div className="w-9/12 space-y-2 md:w-5/12 ">
                <Skeleton className="h-5" />
                <Skeleton className="h-5 w-11/12" />
            </div>
        </div>
    );
};

export default SkeletonCard;
