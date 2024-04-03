const Stat = ({
    stat,
    message,
    currency
}: {
    stat: string | number;
    message: string;
    currency: string;
}) => {
    return (
        <>
            <p className="text-2xl font-bold leading-normal text-white">
                {stat} {currency}
            </p>
            <p className="text-lg font-normal">{message}</p>
        </>
    );
};

export default Stat;
