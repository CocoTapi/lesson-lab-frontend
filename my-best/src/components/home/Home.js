//import { useRouteLoaderData } from "react-router-dom";
import File from "../user_page/File";
import classes from '../css/home/home.module.css';
import { GoHeartFill } from "react-icons/go";


function Home() {
    // const user = useRouteLoaderData('root');
    // let token;
    // if(user) token = user.token;  
   
    return (
        <div >
            <header className={classes.label}>
                <div className={classes.labelItem}>
                    <h4><GoHeartFill /></h4>
                    Likes
                </div>
                <div className={classes.labelItem}>My Uploads</div>
                <div className={classes.labelItem}>Playlists</div>
                <div className={classes.labelItem}>Profile</div>
            </header>
            <File>
                <div>Profile</div>
            </File>
    
        </div>
    )
};

export default Home;