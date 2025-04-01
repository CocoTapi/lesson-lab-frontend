import { Outlet } from "react-router-dom";
import MainNavigation from "../../components/home/MainNavigation";
import Footer from "../../components/home/Footer";
import classes from './RootLayout.module.css';
import ScrollToTop from "../util/ScrollToTop";

function RootLayout(){

    return (
        <div className={classes.rootLayout}>
            <ScrollToTop />
            <MainNavigation />
            <main className={classes.mainContent}>
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

export default RootLayout;