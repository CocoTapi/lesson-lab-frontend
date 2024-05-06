import { NavLink, useRouteLoaderData } from "react-router-dom";
import { GoHeartFill } from "react-icons/go";
import classes from '../css/user_page/MyPageNavigation.module.css'
import PageHeader from "../UI/PageHeader";

function MyPageNavigation(){
    const user = useRouteLoaderData('root');
    let user_id;
    let token;
    //let user_name;
    if(user) {
        token = user.token;
        user_id = user.user_id;
        //user_name = user.user_name
    }

    return (
        <header>
           <PageHeader title='My Page' token={token} link={'/mypage'} />
            <nav className={classes.label}>
                    <NavLink
                            className={({ isActive }) => isActive ? `${classes.active} ${classes.labelItem} ` : classes.labelItem}
                            to={token ? `/mypage/${user_id}`: '../auth?mode=login'}
                        >
                           Profile
                    </NavLink>
                    <NavLink
                            className={({ isActive }) => isActive ? `${classes.active} ${classes.labelItem} ` : classes.labelItem}
                            to={token ? `/mypage/${user_id}/likes`: '../auth?mode=login'}
                    >
                            <h4><GoHeartFill /></h4>
                            Likes
                    </NavLink>
                    <NavLink
                            className={({ isActive }) => isActive ? `${classes.active} ${classes.labelItem} ` : classes.labelItem}
                            to={token ? `/mypage/${user_id}/uploads`: '../auth?mode=login'}
                        >
                        My Uploads

                    </NavLink>       
                    <NavLink
                            className={({ isActive }) => isActive ? `${classes.active} ${classes.labelItem} ` : classes.labelItem}
                            to={token ? `/mypage/${user_id}/go-to-lists`: '../auth?mode=login'}
                        >
                        Go-to-lists
                    </NavLink>
            </nav>
        </header>
    )
}

export default MyPageNavigation;