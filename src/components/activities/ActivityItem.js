import { useState, useEffect } from "react";
import { useRouteLoaderData, useSubmit, Link } from "react-router-dom";
import classes from '../css/activities/ActivityItem.module.css';
import { GoHeart,GoHeartFill, GoBookmark } from "react-icons/go";
import ButtonS from "../UI/ButtonS";
import SortBar, { getSortedActivities } from "../UI/SortBar";
import SummaryCard from "./SummaryCard";
import Tag from "../UI/Tag";
import { FaRegCircleUser } from "react-icons/fa6";
import PlaylistSelection from "./PlaylistSelection";
import { baseName } from "../../App";
import { swalError } from "../../pages/util/swalModal";

function ActivityItem({ activity, activities }) {
    const user = useRouteLoaderData('root');
    const token = user ? user.token : null;
    const user_id = user ? user.user_id : 'guest';
    
    const submit = useSubmit();
    const [showPlaylistSelection, setShowPlaylistSelection] = useState(false);
    const [showTags, setShowTags] = useState(false);
    const initialCount = activity.like_count;
    const [activityCount, setActivityCount] = useState(initialCount);

    // for sort
    const [ sortOption, setSortOption ] = useState(''); 
 
    const sortedActivities = getSortedActivities( sortOption, activities );
    



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
        // optimistic update
        if (is_favorited === true){
            setActivityCount((prev) => prev - 1);
        } else if (is_favorited === false) {
            setActivityCount((prev) => prev + 1);        
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

    // create new playlist and add the activity in it
    const handleSubmitNewPlaylist = () => {
        // Get today's date 
        const now = new Date();

        // YYYY-MM-DD HH:mm:ss
        const formattedDate = 
            `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}/${now.getFullYear()}-${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;  
        
            if(!formattedDate) throw new Error('Fail to get date.')

        const playlist_title = `New Playlist - ${formattedDate}`;
        const activity_id = activity.activity_id;
        const activity_duration = activity.duration;

        // Check the data validity
        if (!playlist_title | !activity_id | !activity_duration) {
            swalError()
            setShowPlaylistSelection(false);   
        } else {
            submit({ playlist_title, activity_id, user_id, activity_duration }, { method: 'POST'})
        }

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
                    onCreatePlaylist={handleSubmitNewPlaylist}
                />
            }
            
            <div className={classes.contents}>
                {/* sort bar for large screen */}
                <div className={classes.sortBar} >
                    <SortBar  onSortChange={setSortOption} />
                </div>

               
                <div className={classes.frame}>
                     {/* activity list for large screen. Sortable */}
                    <ul className={classes.list}>
                        {activities.slice(0, 3).map((item) => (
                            <li key={item.activity_id}>
                                <SummaryCard activity={item} link={`../${item.activity_id}`}/>
                            </li>
                        ))}
                    </ul>

                    <div className={classes.detailCard}>
                        <div className={classes.detailCardContents}>
                            {/* img */}
                            <div className={classes.detailCardImage}>
                                <img src={`${baseName}/images/large/${activity.image_num || 1}.png`} alt="example" />
                            </div>

                            {/* title */}
                            <h1>{activity.title}</h1>
                            
                            {/* icons */}
                            <div className={classes.detailCardIcons}>
                                {activity.is_favorited ? 
                                    <GoHeartFill onClick={() => handleAddFavorite(activity.is_favorited)} /> :
                                    <GoHeart onClick={() => handleAddFavorite(activity.is_favorited)} />
                                }
                                <GoBookmark onClick={handleAddPlaylist} /> 
                            </div>

                            <div className={classes.detailCardCreatorInfo}>
                                {/* like count */}
                                <p>{activityCount} likes</p>

                                {/* creator */}
                                <div className={classes.creator} >
                                  <FaRegCircleUser className={classes.creatorIcon}/>
                                    <p>{activity.user_name}</p>
                                </div>  
                            </div>

                            {/* Detail */}
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
                                        <p className={classes.materials}>{activity.materials}</p>
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
                                        <p className={classes.longText}>{activity.summary}</p>
                                    </div>
                                    <div className={classes.detailItem}>
                                        <p className={classes.labelTitle}>Objectives:</p>
                                        <p className={classes.longText}>{activity.objectives}</p>
                                    </div>
                                    <div className={classes.detailItem}>
                                        <p className={classes.labelTitle}>Instructions :</p>
                                        <p className={classes.longText}>{activity.instructions}</p>
                                    </div>
                                    <div className={classes.detailItem}>
                                        <p className={classes.labelTitle}>References :</p>
                                        <div className={classes.reference}>
                                            {activity.links ? 
                                                <a href={activity.links}>
                                                    {activity.links}
                                                </a> 
                                            : <p>none</p>
                                            }
                                        </div>
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