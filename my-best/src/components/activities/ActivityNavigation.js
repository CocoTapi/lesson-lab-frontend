import { NavLink, useRouteLoaderData } from "react-router-dom";
import { useState } from "react";
import classes from '../css/activities/ActivityNavigation.module.css';
import { TiPlus } from "react-icons/ti";
import { FiSearch } from "react-icons/fi";

function ActivityNavigation(){
    const [searchTerm, setSearchTerm] = useState('');
    const user = useRouteLoaderData('root');
    let token;
    if(user) token = user.token;

    const handleSearchTermChange = (event) => {
        setSearchTerm(event.target.value);
    }

    //TODO: handle search term



    return (
        <div className={classes.frame}>
            <ul className={classes.left}>
                <li className={classes.title}>
                    <NavLink
                        to="/activities"
                    >
                        Activities
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to={token ? "/activities/new" : "../auth?mode=login"}
                    >
                        <button className={classes.addButton}>
                            <TiPlus />
                            <span>Add Activity</span> 
                        </button>
                    </NavLink>
                </li>
            </ul>
            <div>
                <form>
                    <input className={classes.inputFrame} value={searchTerm} onChange={handleSearchTermChange} placeholder="Search"/>
                </form>
            </div>
        </div>
    )
}

export default ActivityNavigation;