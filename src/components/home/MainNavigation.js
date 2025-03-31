import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import classes from '../css/home/MainNavigation.module.css';
import { IoMenu } from "react-icons/io5";
import { IoIosCloseCircleOutline } from "react-icons/io";

function MainNavigation() {
    const user_id = 'guest';
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
            <div className={classes.headerContent}>

          
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
            <div className={classes.menuBox}>
            { showMenuBar && !displayMenu ? (
                <div className={classes.menuIconComponent} onClick={handleOpenMenu}><IoMenu /></div>
            ) : (
                <div className={classes.menuIconComponent} onClick={handleOpenMenu}><IoIosCloseCircleOutline /></div>
            )} 
                {displayMenu && 
                    <div className={classes.menuComponent}>
                        <NavLink className={classes.menuItem}  to="/" onClick={handleCloseMenu} activeclassname="active" >Home</NavLink>
                        <NavLink className={classes.menuItem} to="/activities" onClick={handleCloseMenu} activeclassname="active">Activities</NavLink>
                        <NavLink className={classes.menuItem} to={`/mypage/${user_id}`} onClick={handleCloseMenu} activeclassname="active">My Page</NavLink>
                    </div>
                }
            </div>

            </div>
           
        </header>
    );
}

export default MainNavigation;
