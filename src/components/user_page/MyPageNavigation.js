import { NavLink, useRouteLoaderData } from "react-router-dom";
import { GoHeartFill } from "react-icons/go";
import classes from '../css/user_page/MyPageNavigation.module.css'
import PageHeader from "../UI/PageHeader";

function MyPageNavigation(){
    const user = useRouteLoaderData('root');
    const token = user ? user.token : null;
    const user_id = user ? user.user_id : 'guest';


    return (
        <header>
           <PageHeader title='My Page' token={token} link={`/mypage/${user_id}`} />
            <nav className={classes.labels}>
                    <NavLink
                            className={({ isActive }) => isActive ? `${classes.active} ${classes.labelItem} ` : classes.labelItem}
                            to={`/mypage/${user_id}`}
                            end
                        >
                           Profile
                    </NavLink>

                    <NavLink
                        className={({ isActive }) => isActive ? `${classes.active} ${classes.labelItem} ` : classes.labelItem}
                        to={`/mypage/${user_id}/favorites`}
                        end
                    >
                            <h4><GoHeartFill /></h4>
                            Likes
                    </NavLink>

                    {user_id !== 'guest' &&
                        <NavLink
                                className={({ isActive }) => isActive ? `${classes.active} ${classes.labelItem} ` : classes.labelItem}
                                to={token ? `/mypage/${user_id}/uploads`: '../auth?mode=login'}
                                end
                            >
                            My Uploads
                        </NavLink>     
                    }

                    <NavLink
                            className={({ isActive }) => isActive ? `${classes.active} ${classes.labelItem} ` : classes.labelItem}
                            to={`/mypage/${user_id}/playlists`}
                            end
                        >
                        Playlists
                    </NavLink>
            </nav>
        </header>
    )
}

export default MyPageNavigation;