import { useRouteLoaderData } from "react-router-dom";
// import { useUserContext } from "../../pages/util/UserProvider";

function Home() {
    //const token = useRouteLoaderData('root');
    const user = useRouteLoaderData('root');
    let token;
    if(user) token = user.token;
    console.log(token);
    

    // const { userInfo } = useUserContext();
    // const user_name = userInfo.user_name;
   
    return (
        <div>
            <div>Home</div>
            {/* {token &&
                <div>
                    <h1>{`Welcome back ${user_name}`}</h1>
                </div>
            } */}
        </div>
    )
};

export default Home;