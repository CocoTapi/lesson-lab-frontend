import { Link } from 'react-router-dom';
import SmallCard from '../UI/SmallCard';
import { GoHeart, GoBookmark } from "react-icons/go";
import classes from '../css/activities/SummaryCard.module.css';

function SummaryCard({ activity, link }) {
    console.log(link);
    return (
        <SmallCard>
            <div className={classes.card}>
                <Link to={link}>
                    <div className={classes.duration}>Duration: {activity.duration} min</div>
                    <img src='/images/small/1.png' alt="example" />
                    <h2>{activity.title}</h2>
                    <div className={classes.icons}>
                        <GoHeart />
                        <GoBookmark />
                    </div>
                    <p>{activity.like_count} likes</p>
                    <p>{activity.summary}</p>
                    <p>Age group: {activity.age_group}</p>
                </Link>
            </div>
        </SmallCard>
    )
}

export default SummaryCard;