import { NavLink } from "react-router-dom";

function ActivityNavigation(){
    //const token = useRouteLoaderData('root');

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
                    
                        <NavLink
                            to="/activities/new"
                        >
                            Add Activity
                        </NavLink>
                    
                </ul>
            </nav>
        </header>
    )
}

export default ActivityNavigation;