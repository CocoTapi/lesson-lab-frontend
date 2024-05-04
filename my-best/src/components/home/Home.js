//import { useRouteLoaderData } from "react-router-dom";
import File from "../user_page/File";


function Home() {
    // const user = useRouteLoaderData('root');
    // let token;
    // if(user) token = user.token;  
   
    return (
        <div >
            <div>Home</div>
            <File>
                <div>Profile</div>
            </File>
    
        </div>
    )
};

export default Home;