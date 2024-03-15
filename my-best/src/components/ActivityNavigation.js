import { NavLink } from "react-router-dom";

function ActivityNavigation(){
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
                </ul>
            </nav>
        </header>
    )
}

export default ActivityNavigation;