import { useRouteLoaderData } from "react-router-dom";
import { useUserContext } from "./util/UserProvider";
import { useContext } from "react";

function HomePage() {
    const token = useRouteLoaderData('root');

    const { userInfo } = useUserContext();
    const userName = userInfo.user_name;
    const userId = userInfo.user_id;
    // const { userData } = {userId: 100, userName:'Dodger'};
    // const { userId, userName } = userData;
    console.log(userInfo)
    return (
        <div>
            {!token && <div>Home</div>}
            {token &&
                <div>
                    <hi>{`Welcome back ${userName}`}</hi>
                    <div>User Id: {userId}</div>
                </div>
            }
        </div>
    )
};

export default HomePage;