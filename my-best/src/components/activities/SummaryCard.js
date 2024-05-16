import { Link } from 'react-router-dom';
import { GoHeart, GoHeartFill, GoBookmark } from "react-icons/go";
import classes from '../css/activities/SummaryCard.module.css';

function SummaryCard({ activity, link }) {
   
    return (
        <Link to={link}>
            <div className={classes.smallCard}>
                <div className={classes.card}>
                    <div className={classes.duration}>Duration: {activity.duration} min</div>
                    <div className={classes.image}>
                        <img src='/images/small/1.png' alt="example" style={{ borderRadius: '12px' }} />
                    </div>
                    <div className={classes.contents}>
                        <h2>{activity.title}</h2>
                        <div className={classes.icons}>
                            {activity.is_favorited ? <GoHeartFill /> : <GoHeart />}
                            <GoBookmark />
                        </div>
                        <p>{activity.like_count} likes</p>
                        <p>{activity.summary}</p>
                        <p>Age group: {activity.age_group}</p>  
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default SummaryCard;