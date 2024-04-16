import { useRouteLoaderData } from "react-router-dom";
import { useUserContext } from "../../pages/util/UserProvider";

function Home() {
    const token = useRouteLoaderData('root');

    const { userInfo } = useUserContext();
    const user_name = userInfo.user_name;
   
    console.log(userInfo)
    return (
        <div>
            {!token && <div>Home</div>}
            {token &&
                <div>
                    <h1>{`Welcome back ${user_name}`}</h1>
                </div>
            }
        </div>
    )
};

export default Home;