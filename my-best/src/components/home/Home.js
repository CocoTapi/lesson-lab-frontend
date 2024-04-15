import { useRouteLoaderData } from "react-router-dom";
import { useUserContext } from "../../pages/util/UserProvider";

function Home() {
    const token = useRouteLoaderData('root');

    const { userInfo } = useUserContext();
    const user_name = userInfo.user_name;
    const user_id = userInfo.user_id;
    // const { userData } = {userId: 100, userName:'Dodger'};
    // const { userId, userName } = userData;
    console.log(userInfo)
    return (
        <div>
            {!token && <div>Home</div>}
            {token &&
                <div>
                    <hi>{`Welcome back ${user_name}`}</hi>
                </div>
            }
        </div>
    )
};

export default Home;