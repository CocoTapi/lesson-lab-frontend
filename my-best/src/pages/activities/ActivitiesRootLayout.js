import { Outlet } from "react-router-dom";
import ActivityNavigation from "../../components/ActivityNavigation"

function ActivitiesRootLayout(){
    return (
        <>
            <ActivityNavigation />
            <main>
                <Outlet />
            </main>
        </>
    )
}

export default ActivitiesRootLayout;