import { NavLink } from 'react-router-dom';
import classes from '../css/UI/PageHeader.module.css';
// import { TiPlus } from "react-icons/ti";

function PageHeader({ title, token, link }){
    
    return (
        <div className={classes.frame}>
             <ul className={classes.left}>
                <li>
                    <NavLink
                        to={link}
                        className={classes.title}
                    >
                        {title}
                    </NavLink>
                </li>
                {/* 
                    TODONOW
                    <li>
                    <NavLink
                        to={"/activities/new"}
                    >
                        <button className={classes.addButton}>
                            <TiPlus />
                            <span>Add Activity</span> 
                        </button>
                    </NavLink>
                </li> */}
            </ul>
        </div>
    )
}

export default PageHeader;