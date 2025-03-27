import { useState, useEffect } from "react";
import { useRouteLoaderData, useSubmit, Link } from "react-router-dom";
import classes from '../css/activities/ActivityItem.module.css';
import { GoHeart,GoHeartFill, GoBookmark } from "react-icons/go";
import ButtonS from "../UI/ButtonS";
import SortBar from "../UI/SortBar";
import SummaryCard from "./SummaryCard";
import Tag from "../UI/Tag";
import { FaRegCircleUser } from "react-icons/fa6";
import PlaylistSelection from "./PlaylistSelection";

function ActivityItem({ activity, activities }) {
    const user = useRouteLoaderData('root');
    const token = user ? user.token : null;
    const user_id = user ? user.user_id : 'guest';
    const submit = useSubmit();
    const [showPlaylistSelection, setShowPlaylistSelection] = useState(false);
    const [showTags, setShowTags] = useState(false);
    const initialCount = activity.like_count;
    const [activityCount, setActivityCount] = useState(initialCount);

     //handle screen sizes change
     useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setShowTags(true);
            } else {
                setShowTags(false);
            }
        };

        handleResize();

        // Listen for resize events
        window.addEventListener('resize', handleResize);

        // Clean up
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleAddFavorite = (is_favorited) => { 
        if (user_id === 'guest'){
            if (is_favorited === true && initialCount < activityCount){
                setActivityCount((prev) => prev - 1);
            } else if (is_favorited === false) {
                setActivityCount((prev) => prev + 1);        
            }
        }
        submit({ user_id, is_favorited }, { method: "POST" });
    }

    const handleAddPlaylist = (id) => {
        setShowPlaylistSelection(true);
    }

    const handlePlaylistSubmit = (playlist_id) => {
        const activityDuration = activity.duration;
        submit({ user_id, playlist_id, activityDuration }, { method: "PATCH"});
        setShowPlaylistSelection(false);
    }

    const handleCancel = () => {
        setShowPlaylistSelection(false);
    }

    return (
        <div className={classes.main}>
            {/* Modal: select playlist*/}
            {showPlaylistSelection && 
                <PlaylistSelection 
                    user_id={user_id} 
                    token={token} 
                    onPlaylistSubmit={handlePlaylistSubmit} 
                    onClose={handleCancel} 
                    current_activity_id={activity.activity_id}
                />
            }
            
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
                        <div className={classes.detailCardContents}>
                            <div className={classes.detailCardImage}>
                                <img src={`/full-stack-project-frontend/images/large/${activity.image_num || 1}.png`} alt="example" />
                            </div>
                            <h1>{activity.title}</h1>
                            <div className={classes.detailCardIcons}>
                                {activity.is_favorited ? 
                                    <GoHeartFill onClick={() => handleAddFavorite(activity.is_favorited)} /> :
                                    <GoHeart onClick={() => handleAddFavorite(activity.is_favorited)} />
                                }
                                <GoBookmark onClick={handleAddPlaylist} /> 
                            </div>
                            <div className={classes.detailCardCreatorInfo}>
                                <p>{activityCount} likes</p>
                                <div className={classes.creator} >
                                    <p className={classes.creatorIcon} ><FaRegCircleUser /></p>
                                    <p>{activity.user_name}</p>
                                </div>  
                            </div>
                            <div className={classes.detailCardDetails}>
                                <div className={classes.detailLeft}>
                                    <div className={`${classes.detailItem} ${classes.flexItem}`}>
                                        <p className={classes.labelTitle}>Durations :</p>
                                        <p>{activity.duration === 31 ? '30 ~' : activity.duration} mins</p>
                                    </div>
                                    <div className={`${classes.detailItem} ${classes.flexItem}`}>
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
                                            : 'none'
                                            }
                                        </p>
                                    </div>
                                    {showTags && 
                                        <div className={classes.detailItem}>
                                            {activity.tags.map((tag) => (
                                            <Tag key={tag}>{tag}</Tag>
                                            ))}
                                        </div>
                                    }
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