import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Accordion from "../UI/Accordion";
import classes from '../css/user_page/PlaylistItem.module.css';
import { FaStar } from "react-icons/fa";
import { MdAddCircle } from "react-icons/md";
import { GoTrash } from "react-icons/go";
import IconButton from "../UI/IconButton";

function PlaylistItem({list, onRemoveActivity, onDeletePlaylist, onAddActivity}) {
    const [ showStarIcon, setshowStarIcon] = useState(false);
    const [ showSummary, setShowSummary ] = useState(false);

    //TODO: handle sortOption

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 640) {
                setshowStarIcon(true);
                setShowSummary(true);
            } else {
                setshowStarIcon(false);
                setShowSummary(false);
            }
        };

        handleResize();

        // Listen for resize events
        window.addEventListener('resize', handleResize);

        // Clean up
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className={classes.accordionComponent}>
            <Accordion 
                headerTitle={ showStarIcon ?
                    list.playlist_title
                : (
                    <div className={classes.playlistTitle}>
                        <p className={classes.star}><FaStar /></p> 
                        <p>{list.playlist_title}</p>
                    </div>
                    
                ) 
                }
                headerContents={
                    <div className={classes.totalDuration}>
                        <p className={classes.labelTitle}>Total Duration :</p>
                        {userPlaylists[index].total_duration ? 
                            <p className={classes.info}>{userPlaylists[index].total_duration} mins</p>
                            : <p className={classes.info}> 0 mins</p>
                        }
                    </div>
                }
                topImage={ showStarIcon ? (
                    <div className={classes.star}>
                        <p><FaStar /></p>
                    </div>
                ) : ''
                }
                activityDetail={
                    <ul>
                        {userPlaylists[index].activity_ids[0] !== null && userPlaylists[index].activity_ids.map((item, i) => (
                            <li key={i}> 
                            <div className={classes.activityItemComponent}>
                                <h1 className={classes.listNum}>
                                                {i + 1}.
                                            </h1>
                                <Accordion 
                                    headerTitle={userPlaylists[index].activity_titles[i]}
                                    headerContents={
                                        <div>
                                            {showSummary && (
                                                <div className={classes.detailItem}>
                                                    <p>{userPlaylists[index].summaries[i]}</p>
                                                </div>
                                            )}
                                            
                                            <div className={classes.durationGroup} >
                                                <p className={classes.labelTitle} >Duration :</p>
                                                <p className={classes.info} >{userPlaylists[index].durations[i]} mins</p>
                                            </div>
                                        </div>
                                    }
                                    topImage={ 
                                        <div className={classes.customList}>
                                            <img src='/images/accordionSmall/1.png' alt="example" style={{ borderRadius: '10px' }}/>
                                        </div>
                                    }
                                    activityDetail={
                                        <div className={classes.accordionDetail}>
                                            <div className={classes.leftDetailItems}>
                                                <div className={classes.detailItem}>
                                                    <p className={classes.labelTitle}>Materials :</p>
                                                    <p>{userPlaylists[index].materials[i]}</p>
                                                </div>
                                            </div>
                                            <div className={classes.rightDetailItems}>
                                                {!showSummary && (
                                                    <div className={classes.detailItem}>
                                                        <p className={classes.labelTitle}>Summary :</p>
                                                        <p>{userPlaylists[index].summaries[i]}</p>
                                                    </div>
                                                )}
                                                <div className={classes.detailItem}>
                                                    <p className={classes.labelTitle}>Objectives :</p>
                                                    <p>{userPlaylists[index].objectives[i]}</p>
                                                </div>
                                                <div className={classes.detailItem}>
                                                    <p className={classes.labelTitle}>Instructions :</p>
                                                    <p>{userPlaylists[index].instructions[i]}</p>
                                                </div>
                                                <div className={classes.detailItem}>
                                                    <p className={classes.labelTitle}>References :</p>
                                                    <p className={classes.accordionReference}>
                                                        {userPlaylists[index].links[i] ? 
                                                            <Link to={userPlaylists[index].links[i]}>
                                                                {userPlaylists[index].links[i]}
                                                            </Link> 
                                                        : <p>none</p>
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    buttonChildren={
                                        <IconButton onClick={() => onRemoveActivity(userPlaylists[index].activity_ids[i], userPlaylists[index].activity_titles[i], userPlaylists[index].playlist_id, userPlaylists[index].playlist_title)}>
                                            <GoTrash className={classes.playlistItemTrash} />
                                        </IconButton>
                                    }
                                    
                                />
                                </div>  
                            </li>
                        ))}  
                    </ul>
                }
                buttonChildren={
                    <div className={classes.iconButtonGroup}>
                        <IconButton onClick={onAddActivity}>
                            <MdAddCircle className={classes.plusIconButton} />
                        </IconButton>
                        <IconButton onClick={() => onDeletePlaylist(list.playlist_id, list.playlist_title)}>
                            <GoTrash className={classes.trashIconButton} />
                        </IconButton>   
                    </div>
                }
            />
        </div>
    )

}

export default PlaylistItem;