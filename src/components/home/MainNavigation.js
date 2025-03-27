import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { useLoaderData, Form } from "react-router-dom";
import classes from '../css/home/MainNavigation.module.css';
import { IoMenu } from "react-icons/io5";
import { IoIosCloseCircleOutline } from "react-icons/io";

function MainNavigation() {
    const user = useLoaderData();  // Assuming user data is correctly provided
    const token = user ? user.token : null;
    const user_id = user ? user.user_id : 'guest';
    const user_name = user ? user.user_name : null;
    const user_initial = user_name ? user_name.split('')[0] : null;
    const [showMenuBar, setShoeMenuBar] = useState(false);
    const [displayMenu, setDisplayMenu] = useState(false);
 
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 640) {
                setShoeMenuBar(true);
            } else {
                setShoeMenuBar(false);
            }
        };

        handleResize();

        // Listen for resize events
        window.addEventListener('resize', handleResize);

        // Clean up
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleOpenMenu = () => {
        setDisplayMenu(!displayMenu); 
    }

    const handleCloseMenu = () => {
        setDisplayMenu(false);
    }

   

    return (
        <header className={classes.header}>
            <div className={classes.left}>
           
                <NavLink to="/" className={classes.logo}>
                    LessonLab
                </NavLink>
                { !showMenuBar && 
                    <>
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
                        <NavLink
                            to={`/mypage/${user_id}`}
                            className={({ isActive }) => isActive ? `${classes.active} ${classes.link}` : classes.link}
                            >
                                My Page
                        </NavLink>
                    </>
                }

            </div>
            <div className={classes.right}>
                {!token && (
                    <div className={classes.rightContent}> 
                            <NavLink
                                to="/auth?mode=login"
                                className={classes.authFrame}
                            >
                                <button className={classes.auth}>Login</button>
                            </NavLink>
                            <Link to="/auth/signup" >
                                <button className={classes.signupButton}>
                                Sign Up
                                </button>
                            </Link>
                    </div>
                )}
                {token && (
                    <div className={classes.rightContent}>
                        <Form action='/logout' method='post' className={classes.authFrame}>
                            <button type="submit" className={classes.auth}>Logout</button>
                        </Form>
                        <Link
                            to={`/mypage/${user_id}`}
                        >
                            <button className={classes.signupButton}>
                                {user_initial}
                            </button>  
                        </Link>
                    </div>
                )}
            </div>
            <div className={classes.menuBox}>
            { showMenuBar && !displayMenu ? (
                <div className={classes.menuIconComponent} onClick={handleOpenMenu}><IoMenu /></div>
            ) : (
                <div className={classes.menuIconComponent} onClick={handleOpenMenu}><IoIosCloseCircleOutline /></div>
            )} 
                {displayMenu && 
                    <div className={classes.menuComponent}>
                        <Link className={classes.menuItem}  to="/" onClick={handleCloseMenu} >Home</Link>
                        <Link className={classes.menuItem} to="/activities" onClick={handleCloseMenu} >Activities</Link>
                        <Link className={classes.menuItem} to="/activities/new" onClick={handleCloseMenu} > Add Activity</Link>
                        <Link className={classes.menuItem} to={`/mypage/${user_id}`} onClick={handleCloseMenu} >My Page</Link>
                        {!token && <Link className={classes.menuItem} to="/auth?mode=login" onClick={handleCloseMenu} >Login</Link>}
                        {!token && <Link  className={classes.menuItem} to="/auth/signup" onClick={handleCloseMenu} >Sign Up</Link>}
                        {token && 
                            <Form className={classes.menuItem} action='/logout' method='post' >
                                <button type="submit" className={classes.auth}>Logout</button>
                            </Form>}
                    </div>
                }
            </div>
           
        </header>
    );
}

export default MainNavigation;
