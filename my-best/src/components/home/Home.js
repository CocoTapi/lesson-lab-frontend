import ButtonS from '../UI/ButtonS';
import classes from '../css/home/home.module.css';
import { Link, useRouteLoaderData} from 'react-router-dom';


function Home() {
    const user = useRouteLoaderData('root');
    const token = user ? user.token : null;
    const user_id = user ? user.user_id : null;

    console.log("homeToken", token)

    return (
        <div className={classes.outerFrame}>
                <div className={classes.topImageComponent}>
                    <div className={classes.imageContents}>
                        <img src='/images/topImage.png' alt='topImage' />
                        <div className={classes.titleTextComponent}>
                            <h1>Achieve</h1>
                            <h1><span>Innovative</span> Education</h1>
                            <h1>and</h1>
                            <h1>Piece of <span>Mind</span></h1>
                        </div>
                    </div>
                   
                </div>
       
            <div className={classes.contentsMenuComponent}>
                <div className={classes.menuBox}>
                    <div className={classes.menuBoxContents}>
                        <h3>Explore Activities That Meet Your Goals</h3>
                        <p>
                            Discover a wide range of activities designed to meet your educational objectives. 
                            Whether you're looking for creative, interactive, or curriculum-aligned tasks, 
                            we've got you covered.
                        </p>
                        <div className={classes.menuBoxButtonComponent}>
                            <Link to='/activities' >
                                <ButtonS className={classes.menuBoxButton} colorScheme='primaryBorder'>Explore Now</ButtonS>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className={classes.menuBox}>
                    <div className={classes.menuBoxContents}>
                        <h3>Create Playlists for Smart Class Management</h3>
                        <p>
                            Efficiently manage your classes by creating playlists of your favorite activities. 
                            Organize, reorder, and prepare your sessions to enhance student engagement 
                            while reducing your workload. 
                        </p>
                        <div className={classes.menuBoxButtonComponent}>
                            <Link to={token ? `/mypage/${user_id}/playlists` : "/auth?mode=login"}  >
                                <ButtonS className={classes.menuBoxButton} colorScheme='primary'>Create Now</ButtonS>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className={classes.menuBox}>
                    <div className={classes.menuBoxContents}>
                        <h3>Share Your Ideas to Enhance Innovative Education</h3>
                        <p>
                            Join our community of educators by sharing your innovative activity ideas. 
                            Contribute to our growing resources and help provide high-quality learning experiences 
                            for more learners everywhere.
                        </p>
                        <div className={classes.menuBoxButtonComponent}>
                            <Link to={token ? "/activities/new" : "/auth?mode=login"}>
                                <ButtonS className={classes.menuBoxButton} colorScheme='primaryBorder'>Add Activity</ButtonS>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
           
)
};

export default Home;