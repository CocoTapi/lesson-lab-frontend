import ButtonS from '../UI/ButtonS';
import classes from '../css/home/home.module.css';
import { Link, useRouteLoaderData, useNavigate } from 'react-router-dom';


function Home() {
    const user = useRouteLoaderData('root');
    const user_id = user ? user.user_id : 'guest';
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        if (path === 'playlist') {
            navigate(`/mypage/${user_id}/playlists`);
        }; 
        
        if (path === 'add activity') {
            // if (user_id !== 'guest'){
                navigate("/activities/new")
            // } else if (user_id === 'guest') {
            //     navigate("/auth?mode=login", {
            //         state: {
            //             prev_location: '/activities/new'
            //         }
            //     })
            // } 
        };
       
    }

    return (
        <div className={classes.outerFrame}>
                <div className={classes.topImageComponent}>
                    <div className={classes.imageContents}>
                        <img src={`/lesson-lab-frontend/images/topImage.png`} alt='topImage' />
                        <div className={classes.titleTextComponent}>
                            <h1>Achieve</h1>
                            <h1><span>Innovative</span> Education</h1>
                            <h1>and</h1>
                            <h1>Peace of <span>Mind</span></h1>
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
                                <ButtonS className={classes.menuBoxButton} colorScheme='primaryBorder'>
                                    Explore Now
                                </ButtonS>
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
                            <ButtonS 
                                className={classes.menuBoxButton} 
                                colorScheme='primary' 
                                onClick={() => handleNavigate('playlist')}
                            >
                                Create Now
                            </ButtonS>
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
                            
                            <ButtonS 
                                className={classes.menuBoxButton} 
                                colorScheme='primaryBorder' 
                                onClick={() => handleNavigate('add activity')} 
                            >
                                Add Activity
                            </ButtonS>
                        </div>
                    </div>
                </div>
            </div>
        </div>
           
)
};

export default Home;