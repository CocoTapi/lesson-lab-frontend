import { useRouteLoaderData } from "react-router-dom";
import PageHeader from "../UI/PageHeader";

function ActivityNavigation(){
    const user = useRouteLoaderData('root');
    let token;
    if(user) token = user.token;

    return (
        <PageHeader title='Activities' token={token} link={'/activities'} />     
    )
}

export default ActivityNavigation;