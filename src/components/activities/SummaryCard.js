import { Link } from 'react-router-dom';
import { GoHeart, GoHeartFill, GoBookmark } from "react-icons/go";
import classes from '../css/activities/SummaryCard.module.css';

function SummaryCard({ activity, link }) {

    return (
        <Link to={link}>
            <div className={classes.summaryCard}>
                <div className={classes.summaryCardContents}>
                    <div className={classes.summaryCardDuration}>
                        Duration: {activity.duration === 31 ? '30 ~ ' : activity.duration} min</div>
                    <div className={classes.summaryCardImage}>
                        <img src={`/full-stack-project-frontend/images/large/${activity.image_num || 1}.png`} alt="example" />
                    </div>
                    <div className={classes.summaryCardDetails}>
                        <h2>{activity.title}</h2>
                        <div className={classes.summaryCardIcons}>
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