import { Link } from "react-router-dom";
import ConnectButton from "./ConnectButton";

const Navbar = () => {
    return (
        <nav className="mx-auto mb-10 flex w-11/12 max-w-[1110px] items-center py-5 pl-2 text-white">
            <Link to="/" className="text-lg font-bold max-[460px]:hidden">
                FundMe
            </Link>
            <Link to="donations" className="ml-auto mr-6 max-[460px]:ml-0 max-[460px]:mr-auto">
                Donations
            </Link>
            <ConnectButton />
        </nav>
    );
};

export default Navbar;
