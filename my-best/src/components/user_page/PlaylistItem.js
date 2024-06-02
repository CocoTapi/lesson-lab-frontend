import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Accordion from "../UI/Accordion";
import classes from '../css/user_page/PlaylistItem.module.css';
import { FaStar } from "react-icons/fa";
import { MdAddCircle } from "react-icons/md";
import { GoTrash } from "react-icons/go";
import IconButton from "../UI/IconButton";

function PlaylistItem({playlist, onRemoveActivity, onDeletePlaylist, onAddActivity, playlistButtons, activityButtons}) {
    const [ showStarIcon, setshowStarIcon] = useState(false);
    const [ showSummary, setShowSummary ] = useState(false);

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
                    playlist.playlist_title
                : (
                    <div className={classes.playlistTitle}>
                        <p className={classes.star}><FaStar /></p> 
                        <p>{playlist.playlist_title}</p>
                    </div>
                    
                ) 
                }
                headerContents={
                    <div className={classes.totalDuration}>
                        <p className={classes.labelTitle}>Total :</p>
                        {playlist.total_duration ? 
                            <p className={classes.info}>{playlist.total_duration} mins</p>
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
                        {playlist.activities[0].activity_id && playlist.activities.map((item, i) => (
                            <li key={i}> 
                            <div className={classes.activityItemComponent}>
                                <h1 className={classes.listNum}>
                                                {i + 1}.
                                            </h1>
                                <Accordion 
                                    headerTitle={<div className={classes.activityTitle}>{item.title}</div>}
                                    headerContents={
                                        <div>
                                            {showSummary && (
                                                <div className={classes.detailItem}>
                                                    <p>{item.summary}</p>
                                                </div>
                                            )}
                                            
                                            <div className={classes.durationGroup} >
                                                <p className={classes.labelTitle} >Duration :</p>
                                                <p className={classes.info} >{item.duration} mins</p>
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
                                                    <p>{item.materials}</p>
                                                </div>
                                            </div>
                                            <div className={classes.rightDetailItems}>
                                                {!showSummary && (
                                                    <div className={classes.detailItem}>
                                                        <p className={classes.labelTitle}>Summary :</p>
                                                        <p>{item.summary}</p>
                                                    </div>
                                                )}
                                                <div className={classes.detailItem}>
                                                    <p className={classes.labelTitle}>Objectives :</p>
                                                    <p>{item.objectives}</p>
                                                </div>
                                                <div className={classes.detailItem}>
                                                    <p className={classes.labelTitle}>Instructions :</p>
                                                    <p>{item.instructions}</p>
                                                </div>
                                                <div className={classes.detailItem}>
                                                    <p className={classes.labelTitle}>References :</p>
                                                    <p className={classes.accordionReference}>
                                                        {item.links ? 
                                                            <Link to={item.links}>
                                                                {item.links}
                                                            </Link> 
                                                        : <p>none</p>
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    buttonChildren={activityButtons ? (
                                        <IconButton onClick={() => onRemoveActivity(item.activity_id, item.title, playlist.playlist_id, playlist.playlist_title)}>
                                            <GoTrash className={classes.playlistItemTrash} />
                                        </IconButton>
                                    ): ''
                                    }
                                    
                                />
                                </div>  
                            </li>
                        ))}  
                    </ul>
                }
                buttonChildren={ playlistButtons? (
                    <div className={classes.iconButtonGroup}>
                        <IconButton onClick={() => onAddActivity(playlist.playlist_id, playlist.user_id, playlist.playlist_title)}>
                            <MdAddCircle className={classes.plusIconButton} />
                        </IconButton>
                        <IconButton onClick={() => onDeletePlaylist(playlist.playlist_id, playlist.playlist_title)}>
                            <GoTrash className={classes.trashIconButton} />
                        </IconButton>   
                    </div>
                ) : ''
                    
                }
            />
        </div>
    )

}

export default PlaylistItem;