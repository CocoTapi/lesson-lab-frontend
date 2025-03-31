import File from "../UI/File";
import classes from '../css/user_page/Profile.module.css';

function Profile({ data }){    

    return (
        <File>
            <div className={classes.outerFrame}>

                <div className={classes.pageTitle}>
                    <h1>Profile</h1>
                </div>

                <div className={classes.profileBox}>
                    <div className={classes.profileContents}>
                        <div className={classes.centerGroup}>
                            <h3>Hi there!</h3>
                            <h3 className={classes.centerGroupTitle}>
                                Check out your liked activities and build your own playlist.
                                Enjoy exploring all the features!
                            </h3>
                        </div>
                    </div>
                </div>  

            </div>
        </File>
    )
};

export default Profile;