import { NavLink } from "react-router-dom";
import ButtonS from "../UI/ButtonS";
import File from "../UI/File";
import classes from '../css/user_page/Profile.module.css';
import { FaEdit } from "react-icons/fa";


function Profile({ data }){
    const userProfile = data.userProfile;
    const user_id = userProfile.user_id; 
    
    return (
        <File>
            <div className={classes.box}>
                <div className={classes.contents}>
                    <div className={classes.item}>
                        <h3>User Name :</h3>
                        <h3>E-mail :</h3>
                        <h3>Password :</h3>
                        <h3>First Name :</h3>
                        <h3>Last Name :</h3>
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
                    <NavLink to={`/mypage/${user_id}/edit`}>
                        <ButtonS>
                            <h4><FaEdit /></h4>
                            <h4>Edit</h4>
                        </ButtonS>
                    </NavLink>
                </div>
            </div>
        </File>
    )
};

export default Profile;