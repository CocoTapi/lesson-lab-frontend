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
                    {token && 
                    <li>
                        <NavLink
                            to="/activities/new"
                        >
                            Add Activity
                        </NavLink>
                    </li>
                    }
                    {!token &&
                    <li>
                        <NavLink
                            to="../auth?mode=login"
                        >
                            Add Activity
                        </NavLink>
                    </li>
                    }
                    
                </ul>
            </nav>
        </header>
    )
}

export default ActivityNavigation;