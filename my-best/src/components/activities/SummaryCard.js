import { Link } from 'react-router-dom';
import SmallCard from '../UI/SmallCard';
import { GoHeart, GoHeartFill, GoBookmark } from "react-icons/go";
import classes from '../css/activities/SummaryCard.module.css';

function SummaryCard({ activity, link }) {
   
    return (
        <Link to={link}>
            <SmallCard>
                <div className={classes.card}>
                        <div className={classes.duration}>Duration: {activity.duration} min</div>
                        <img src='/images/small/1.png' alt="example" style={{ borderRadius: '12px' }} />
                        <h2>{activity.title}</h2>
                        <div className={classes.icons}>
                            {activity.is_favorited ? <GoHeartFill /> : <GoHeart />}
                            <GoBookmark />
                        </div>
                        <p>{activity.like_count} likes</p>
                        <p>{activity.summary}</p>
                        <p>Age group: {activity.age_group}</p>          
                </div>
            </SmallCard>
        </Link>
    )
}

export default SummaryCard;