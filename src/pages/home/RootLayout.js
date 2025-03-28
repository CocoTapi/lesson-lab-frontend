import { Outlet } from "react-router-dom";
import MainNavigation from "../../components/home/MainNavigation";
import Footer from "../../components/home/Footer";
import classes from './RootLayout.module.css';

function RootLayout(){
    return (
        <div className={classes.rootLayout}>
            <MainNavigation />
            <main className={classes.mainContent}>
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

export default RootLayout;