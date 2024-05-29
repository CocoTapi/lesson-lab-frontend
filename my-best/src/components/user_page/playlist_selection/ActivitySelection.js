import { Link } from 'react-router-dom';
import classes from '../../css/user_page/ActivitySelection.module.css';

function ActivitySelection({ title, playlist_id }){
    let selection;
    return (
        <div className={classes.modal}>
            <div className={classes.modalCard}>
                <div className={classes.modalContents}>
                    <p>Where do you want to choose an activity for this playlist?</p>
                    <div className={classes.modalButtonComponent}>
                        <Link to={`${playlist_id}/add_from_fav`}>
                            <button className={classes.modalBigButton} >
                                My likes
                            </button>
                        </Link>
                        <Link to={`${playlist_id}/add_from_uploads`}>
                            <button className={classes.modalBigButton}>
                                My Uploads
                            </button>
                        </Link>
                        <Link to={`${playlist_id}/add_from_all`}>
                            <button className={classes.modalBigButton}>
                                All activities
                            </button>
                        </Link>                  
                    </div> 
                </div>
            </div>
        </div>
    )
}

export default ActivitySelection