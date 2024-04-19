import { Outlet } from "react-router-dom";
import MyPageNavigation from "../../components/user_page/MyPageNavigation";

function UserLayout(){
    return (
        <>
            <MyPageNavigation />
            <main>
                <Outlet />
            </main>
        </>
    )
};

export default UserLayout;

