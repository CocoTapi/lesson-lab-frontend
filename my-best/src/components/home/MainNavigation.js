import { NavLink, Form, useRouteLoaderData } from "react-router-dom";
import classes from '../css/MainNavigation.module.css';

function MainNavigation(){
    const user = useRouteLoaderData('root');
    let token;
    let user_id;
    if(user){ 
        token = user.token;
        user_id = user.user_id;
    } 
   

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
                                to="/auth?mode=login"
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
                             to="/auth/signup"
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
                         <NavLink
                             to="/activities/new"
                             className={( { isActive }) => 
                                 isActive ? classes.active : undefined
                             }   
                         >
                             Add Activity
                         </NavLink>
                     </li>
                    }
                     {token && 
                         <li>
                         <NavLink
                             to={`/mypage/${user_id}`}
                             className={( { isActive }) => 
                                 isActive ? classes.active : undefined
                             }   
                         >
                             My Page
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