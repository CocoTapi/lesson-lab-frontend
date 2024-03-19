import { NavLink, Form, useRouteLoaderData } from "react-router-dom";
import classes from './css/MainNavigation.module.css';

function MainNavigation(){
    const token = useRouteLoaderData();

    return (
        <header className={classes.header}>
            <nav className={classes.list}>
                <ul  className={classes.list}>
                    <li>
                        <NavLink
                            to="/"
                            className={( { isActive }) => 
                                isActive ? classes.active : undefined
                            }   
                        >
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/activities"
                            className={( { isActive }) => 
                                isActive ? classes.active : undefined
                            }   
                        >
                            Activities
                        </NavLink>
                    </li>
                    {!token &&
                        <li>
                            <NavLink
                                to="/auth"
                                className={( { isActive }) => 
                                    isActive ? classes.active : undefined
                                }   
                            >
                                Log In
                            </NavLink>
                        </li>
                    }
                    {!token && 
                         <li>
                         <NavLink
                             to="/auth/sign-up"
                             className={( { isActive }) => 
                                 isActive ? classes.active : undefined
                             }   
                         >
                             Sign Up
                         </NavLink>
                     </li>
                    }
                    {token && 
                        <li>
                        <Form action='/logout' method='post'>
                            <button>Logout</button>
                        </Form>
                        </li>
                    }
                </ul>
            </nav>
        </header>
    )
}

export default MainNavigation;