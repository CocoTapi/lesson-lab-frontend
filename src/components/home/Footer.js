import { Link, useRouteLoaderData } from 'react-router-dom';
import classes from '../css/home/Footer.module.css';
import { FaGoogle, FaLinkedinIn, FaGithub } from "react-icons/fa6";
import { baseName, baseUrl } from '../../App';


function Footer(){
    const user = useRouteLoaderData('root');
    const user_id = user ? user.user_id : 'guest';

    return (
        <footer className={classes.frame}>
            <div className={classes.contents}>
                <div className={classes.iconGroup}>
                    <div>
                        <a href='https://www.google.com/' className={classes.icon} ><FaGoogle /></a>
                    </div>
                    <div>
                        <a href='https://www.linkedin.com/in/shiori-yoshida/'  className={classes.icon} ><FaLinkedinIn /></a>
                    </div>
                    <div>
                        <a href='https://github.com/CocoTapi'  className={classes.icon} ><FaGithub /></a>
                    </div>
                </div>
                <p>Personal Projects:</p>
                <div className={classes.links}>
                    <Link to='/' className={classes.link} >Home</Link>
                    <Link to='/activities' className={classes.link} >Activities</Link>
                    <Link to={`/mypage/${user_id}`} className={classes.link} >My Page</Link>
                </div>
                <h3>LessonLab</h3>
                <p>2024</p>
            </div>
        </footer>
    )
}

export default Footer;