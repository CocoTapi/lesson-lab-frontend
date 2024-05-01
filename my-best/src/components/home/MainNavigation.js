import { NavLink } from "react-router-dom";
import { useLoaderData } from "react-router-dom";
import classes from '../css/home/MainNavigation.module.css';

function MainNavigation() {
    const user = useLoaderData();  // Assuming user data is correctly provided
    const token = user ? user.token : null;
    const user_id = user ? user.user_id : null;
    const user_name = user ? user.user_name : null;
    const user_initial = user_name ? user_name.split('')[0] : null;

    return (
        <header className={classes.header}>
            <div className={classes.left}>
                <NavLink to="/" className={classes.logo}>
                    LessonLab
                </NavLink>
                <NavLink
                    to="/"
                    className={({ isActive }) => isActive ? `${classes.active} ${classes.link}` : classes.link}
                >
                    Home
                </NavLink>
                <NavLink
                    to="/activities"
                    className={({ isActive }) => isActive ? `${classes.active} ${classes.link}` : classes.link}
                >
                    Activities
                </NavLink>
                {token &&
                    <NavLink
                        to={`/mypage/${user_id}`}
                        className={({ isActive }) => isActive ? `${classes.active} ${classes.link}` : classes.link}
                        >
                            My Page
                    </NavLink>
                }
            </div>
            <div className={classes.right}>
                {!token && (
                    <div className={classes.rightContent}> 
                        
                            <NavLink
                                to="/auth?mode=login"
                                className={classes.login}
                            >
                                Login
                            </NavLink>
                       
                        <button className={classes.signupButton}>
                            <NavLink to="/auth/signup" >
                                Sign Up
                            </NavLink>
                        </button>
                    </div>
                )}
                {token && (
                    <div className={classes.rightContent}>
                        <form action='/logout' method='post' className={classes.form}>
                            <button type="submit" className={classes.logoutButton}>Logout</button>
                        </form>
                        <button className={classes.signupButton}>
                            <NavLink
                                to={`/mypage/${user_id}`}
                                >
                                    {user_initial}
                            </NavLink>
                        </button>  
                    </div>
                )}
            </div>
        </header>
    );
}

export default MainNavigation;
