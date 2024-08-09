import { Outlet } from "react-router-dom";
import MainNavigation from "../../components/home/MainNavigation";
import Footer from "../../components/home/Footer";

function RootLayout(){
    return (
        <>
        <MainNavigation />
        <main><Outlet /></main>
        <Footer />
        </>
    )
}

export default RootLayout;