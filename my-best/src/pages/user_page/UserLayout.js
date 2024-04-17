import { Outlet } from "react-router-dom";

function UserLayout(){
    return (
        <>
            <main>
                <Outlet />
            </main>
        </>
    )
};

export default UserLayout;

