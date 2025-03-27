import { NavLink, useNavigate } from "react-router-dom";
import ButtonS from "../UI/ButtonS";
import File from "../UI/File";
import classes from '../css/user_page/Profile.module.css';
import { FaEdit } from "react-icons/fa";
import { formatDateString } from "../../pages/util/formatDate";
import ButtonM from "../UI/ButtonM";

function Profile({ data }){
    const userProfile = data.userProfile;
    const user_id = userProfile.user_id; 
    const navigate = useNavigate();

    let formattedDate = formatDateString(userProfile.last_login)

    const handleLogin = () => {
        navigate('/auth?mode=login', { state: { prev_location: '/mypage'}});
    }

    const handleSignUp = () => {
        navigate('/auth/signup', { state: { prev_location: '/mypage'}});
    }
    
    return (
        <File>
            <div className={classes.outerFrame}>
                <div className={classes.pageTitle}>
                    <h1>Profile</h1>
                </div>
                <div className={classes.profileBox}>
                    {user_id === 'guest' ?(
                        <div className={classes.profileContents}>
                         
                            <div className={classes.centerGroup}>
                                <h3>Hi there!</h3>
                                <h3 className={classes.centerGroupTitle}>
                                Check out your favorite activities and build your own playlist. 
                                Want to save everything and unlock all the features? 
                                Just sign up or log in — it’s quick and easy!
                                </h3>
                                <ButtonM onClick={handleLogin}>Login</ButtonM>
                                <h3>or</h3>
                                <ButtonM onClick={handleSignUp} colorScheme="primary">Sign Up</ButtonM>
                            </div>
                        </div>
                    ) : (
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
                    )}  
                </div>               
            </div>
        </File>
    )
};

export default Profile;