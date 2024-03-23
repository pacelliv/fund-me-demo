import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const RootLayout = () => {
    return (
        <div className="mx-auto min-h-screen">
            <Navbar />
            <main className="mx-auto min-[960px]:mt-20">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default RootLayout;
