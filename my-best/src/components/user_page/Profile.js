import { NavLink } from "react-router-dom";
import ButtonS from "../UI/ButtonS";
import File from "../UI/File";
import classes from '../css/user_page/Profile.module.css';
import { FaEdit } from "react-icons/fa";
import { formatDateString } from "../../pages/util/formatDate";

function Profile({ data }){
    const userProfile = data.userProfile;
    const user_id = userProfile.user_id; 

    let formattedDate = formatDateString(userProfile.last_login)
    
    return (
        <File>
            <div className={classes.outerFrame}>
                <div className={classes.pageTitle}>
                    <h1>Profile</h1>
                </div>
                <div className={classes.profileBox}>
                    <div className={classes.profileContents}>
                        <div className={classes.item}>
                            <h3>User Name :</h3>
                            <p>{userProfile.user_name}</p>
                        </div>
                        <div className={classes.item}>
                            <h3>E-mail :</h3>
                            <p>{userProfile.email}</p>
                        </div>
                        <div className={classes.item}>
                            <h3>Password :</h3>
                            <p>●●●●●●●</p>
                        </div>
                        <div className={classes.item}>
                            <h3>First Name :</h3>
                            <p>{userProfile.first_name}</p>
                        </div>
                        <div className={classes.item}>
                            <h3>Last Name :</h3>
                            <p>{userProfile.last_name}</p>
                        </div>
                        <div className={classes.item}>
                            <h3>Last Login :</h3>
                            <p>{formattedDate}</p>
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
                </div>               
            </div>
        </File>
    )
};

export default Profile;