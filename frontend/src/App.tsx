import "@/config/wallet";
import {
    RouterProvider,
    Route,
    createRoutesFromElements,
    createBrowserRouter
} from "react-router-dom";
import RootLayout from "./components/RootLayout";
import Home, { loader as homeLoader } from "./pages/home/Home";
import Donations, { loader as donationsLoader } from "./pages/donations/Donations";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<RootLayout />}>
            <Route index element={<Home />} loader={homeLoader} />
            <Route path="donations" element={<Donations />} loader={donationsLoader} />
        </Route>
    )
);

const App = () => {
    return (
        <>
            <RouterProvider router={router} />
        </>
    );
};

export default App;
