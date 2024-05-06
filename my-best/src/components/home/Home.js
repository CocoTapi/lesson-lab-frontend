//import { useRouteLoaderData } from "react-router-dom";
import File from "../user_page/File";
import classes from '../css/home/home.module.css';
import { GoHeartFill } from "react-icons/go";
import ButtonS from "../UI/ButtonS";
import { FaEdit } from "react-icons/fa";


function Home() {
    // const user = useRouteLoaderData('root');
    // let token;
    // if(user) token = user.token;  
   
    return (
        <div className={classes.container}>
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
                <div className={classes.box}>
                    <div className={classes.contents}>
                       <div className={classes.item}>
                            <h3>User name :</h3>
                            <h3>E-mail :</h3>
                            <h3>Password :</h3>
                            <h3>First name :</h3>
                            <h3>Last name :</h3>
                            <h3>Last login :</h3>
                       </div>
                       <div className={classes.item}>
                        <h3>All Might!</h3>
                            <h3>email@gmail.com</h3>
                            <h3>password</h3>
                            <h3>first name</h3>
                            <h3>last name</h3>
                            <h3>04/04/2024</h3>
                       </div>                           
                    </div>
                    <div className={classes.editButton}>
                        <ButtonS>
                            <h4><FaEdit /></h4>
                            <h4>Edit</h4>
                        </ButtonS>
                    </div>
                </div>
            </File>
    
        </div>
    )
};

export default Home;