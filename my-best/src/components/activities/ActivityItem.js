import { useRouteLoaderData, useSubmit, Link } from "react-router-dom";
import classes from '../css/activities/ActivityItem.module.css';
import { GoHeart,GoHeartFill, GoBookmark, GoBookmarkFill } from "react-icons/go";
import ButtonS from "../UI/ButtonS";
import SortBar from "../UI/SortBar";
import SummaryCard from "./SummaryCard";
import Tag from "../UI/Tag";

function ActivityItem({ activity, activities }) {
    const user = useRouteLoaderData('root');
    let token;
    let user_id;
    if (user) {
        token = user.token;
        user_id = user.user_id;
    }
    const submit = useSubmit();

    const handleAddFavorite = (user_id, is_favorited) => {
        submit({ user_id, is_favorited }, { method: "POST" });
    }

    const handleDeleteActivity = (title) => {
        const proceed = window.confirm(`Are you sure you want to delete ${title}?`);

        if (proceed) submit(null, { method: 'DELETE' });
    }

    console.log(activities);

    // TODO: passing is_saved
    //TODO: sort


    return (
        <div className={classes.frame}>
            <div className={classes.left}>
                <SortBar size='short' />
                <ul>
                    {activities.map((item) => (
                        <li key={item.activity_id}>
                            <SummaryCard activity={item} link={`./activities/${activity.activity_id}`}/>
                        </li>
                    ))}
                </ul>
            </div>

            <div className={classes.right}>
            <div className={classes.detailCard}>
                <div className={classes.detailContent}>
                    <img src='/images/large/1.png' alt="example" />
                    <h1>{activity.title}</h1>
                    <div className={classes.detailIcons}>
                        {activity.is_favorited ? <GoHeartFill /> : <GoHeart />}
                        {activity.is_saved ? <GoBookmarkFill /> : <GoBookmark /> }
                    </div>
                    <div className={classes.createrInfo}>
                        <p>{activity.like_count} likes</p>
                        <p>user name here</p>
                    </div>
                    <div className={classes.itemContainer}>
                        <div className={classes.detailLeft}>
                            <div className={classes.leftItem}>
                                <p>Durations :</p>
                                <p>{activity.duration}</p>
                            </div>
                            <div className={classes.leftItem}>
                                <p>Age group :</p>
                                <p>{activity.age_group}</p>
                            </div>
                            <div className={classes.leftItem}>
                                <p>Materials :</p>
                                <p>{activity.materials}</p>
                            </div>
                            <div className={classes.leftTags}>
                                {activity.tags.map((tag) => (
                                <Tag key={tag} className={classes.tagFrame}>{tag}</Tag>
                                ))}
                            </div>
                        </div>
                        <div className={classes.detailRight}>
                            <div className={classes.rightItem}>
                                <p>Summary :</p>
                                <p>{activity.summary}</p>
                            </div>
                            <div className={classes.rightItem}>
                                <p>Objectives:</p>
                                <p>{activity.objectives}</p>
                            </div>
                            <div className={classes.rightItem}>
                                <p>Instructions :</p>
                                <p>{activity.instructions}</p>
                            </div>
                            <div className={classes.rightItem}>
                                <p>References :</p>
                                <p className={classes.reference}>
                                    <Link to={activity.links}>
                                        {activity.links}
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className={classes.backButton}>
                    <Link to='../' >
                        <ButtonS colorScheme='primaryBorder'>
                            Back
                        </ButtonS>
                    </Link>
                    </div>
                </div>
            </div>
        </div>
        </div>
       
        
    )
}

export default ActivityItem;