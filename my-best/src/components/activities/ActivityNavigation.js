import { NavLink, useRouteLoaderData } from "react-router-dom";

function ActivityNavigation(){
    const user = useRouteLoaderData('root');
    let token;
    if(user) token = user.token;

    return (
        <header>
            <nav>
                <ul>
                    <li>
                        <NavLink
                            to="/activities"
                        >
                            All Activities
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to={token ? "/activities/new" : "../auth?mode=login"}
                        >
                            Add Activity
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default ActivityNavigation;