import { useRouteLoaderData, useSubmit, Link, useNavigate, useLocation } from "react-router-dom";
import classes from '../css/activities/ActivityItem.module.css';
import { GoHeart,GoHeartFill, GoBookmark, GoBookmarkFill } from "react-icons/go";
import ButtonS from "../UI/ButtonS";
import SortBar from "../UI/SortBar";
import SummaryCard from "./SummaryCard";
import Tag from "../UI/Tag";
import { FaRegCircleUser } from "react-icons/fa6";

function ActivityItem({ activity, activities }) {
    const user = useRouteLoaderData('root');
    let token;
    let user_id;
    if (user) {
        token = user.token;
        user_id = user.user_id;
    }
    const submit = useSubmit();
    const navigate = useNavigate();
    const location = useLocation();

    const handleAddFavorite = (is_favorited) => { 
        console.log("is_favorited:", is_favorited)
        if(!token) {
            navigate('/auth?mode=login', { state: { prev_location: location }});
        } else {
            submit({ user_id, is_favorited }, { method: "POST" });
        }
    }

    const handleDeleteActivity = (title) => {
        const proceed = window.confirm(`Are you sure you want to delete ${title}?`);

        if (proceed) submit(null, { method: 'DELETE' });
    }

    // TODO: passing is_saved
    //TODO: sort

    console.log("activity_item:", activity);

    return (
        <div className={classes.main}>
            <div className={classes.contents}>
                <div className={classes.sortBar} >
                    <SortBar />
                </div>
                <div className={classes.frame}>
                    <ul className={classes.list}>
                        {activities.slice(0, 3).map((item) => (
                            <li key={item.activity_id}>
                                <SummaryCard activity={item} link={`../${item.activity_id}`}/>
                            </li>
                        ))}
                    </ul>

                    <div className={classes.detailCard}>
                        <div className={classes.detailContent}>
                            <div className={classes.image}>
                                <img src='/images/large/1.png' alt="example" />
                            </div>
                            <h1>{activity.title}</h1>
                            <div className={classes.detailIcons}>
                                {activity.is_favorited ? <GoHeartFill onClick={() => handleAddFavorite(activity.is_favorited)} /> : <GoHeart onClick={() => handleAddFavorite(activity.is_favorited)} />}
                                {activity.is_saved ? <GoBookmarkFill /> : <GoBookmark /> }
                            </div>
                            <div className={classes.creatorInfo}>
                                <p>{activity.like_count} likes</p>
                                <div className={classes.creator} >
                                    <p className={classes.creatorIcon} ><FaRegCircleUser /></p>
                                    <p>{activity.user_name}</p>
                                </div>  
                            </div>
                            <div className={classes.itemContainer}>
                                <div className={classes.detailLeft}>
                                    <div className={classes.detailItem}>
                                        <p className={classes.labelTitle}>Durations :</p>
                                        <p>{activity.duration} mins</p>
                                    </div>
                                    <div className={classes.detailItem}>
                                        <p className={classes.labelTitle}>Age group :</p>
                                        <p>{activity.age_group}</p>
                                    </div>
                                    <div className={classes.detailItem}>
                                        <p className={classes.labelTitle}>Materials :</p>
                                        <p>{activity.materials}</p>
                                    </div>
                                    <div className={classes.leftTags}>
                                        {activity.tags.map((tag) => (
                                        <Tag key={tag} className={classes.tagFrame}>{tag}</Tag>
                                        ))}
                                    </div>
                                </div>
                                <div className={classes.detailRight}>
                                    <div className={classes.detailItem}>
                                        <p className={classes.labelTitle}>Summary :</p>
                                        <p>{activity.summary}</p>
                                    </div>
                                    <div className={classes.detailItem}>
                                        <p className={classes.labelTitle}>Objectives:</p>
                                        <p>{activity.objectives}</p>
                                    </div>
                                    <div className={classes.detailItem}>
                                        <p className={classes.labelTitle}>Instructions :</p>
                                        <p>{activity.instructions}</p>
                                    </div>
                                    <div className={classes.detailItem}>
                                        <p className={classes.labelTitle}>References :</p>
                                        <p className={classes.reference}>
                                            {activity.links ? 
                                                <Link to={activity.links}>
                                                    {activity.links}
                                                </Link> 
                                            : <p>none</p>
                                            }
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
        </div>
    )
}

export default ActivityItem;