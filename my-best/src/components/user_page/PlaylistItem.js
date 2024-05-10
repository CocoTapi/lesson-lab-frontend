import { Link } from "react-router-dom";
import Accordion from "../UI/Accordion";
import classes from '../css/user_page/Playlists.module.css';
import { FaStar } from "react-icons/fa";
import { MdAddCircle } from "react-icons/md";
import { GoTrash } from "react-icons/go";

function PlaylistItem({list, index, userPlaylists, onRemoveActivity, onDeletePlaylist, onAddActivity}) {
    return (
        <Accordion 
                    headerTitle={list.playlist_title}
                    headerContents={
                        <div className={classes.totalDuration}>
                            <p className={classes.labelTitle}>Total Duration :</p>
                            {userPlaylists[index].total_duration ? 
                                <p className={classes.info}>{userPlaylists[index].total_duration} mins</p>
                                : <p className={classes.info}> 0 mins</p>
                            }
                        </div>
                    }
                    topImage={
                        <div className={classes.sum}>
                            <p><FaStar /></p>
                        </div>
                    }
                    activityDetail={
                        <ul>
                            {userPlaylists[index].activity_ids[0] !== null && userPlaylists[index].activity_ids.map((item, i) => (
                                <li key={i}>   
                                    <Accordion 
                                        headerTitle={userPlaylists[index].activity_titles[i]}
                                        headerContents={
                                            <div>
                                                <div className={classes.detailItem}>
                                                    <p>{userPlaylists[index].summaries[i]}</p>
                                                </div>
                                                <div className={classes.group} >
                                                    <p className={classes.labelTitle} >Duration :</p>
                                                    <p className={classes.info} >{userPlaylists[index].durations[i]} mins</p>
                                                </div>
                                            </div>
                                        }
                                        topImage={ 
                                            <div className={classes.customList}>
                                                <h1 className={classes.listNum}>
                                                    {i + 1}.
                                                </h1>
                                                <img src='/images/accordionSmall/1.png' alt="example" style={{ borderRadius: '10px' }}/>
                                            </div>
                                        }
                                        activityDetail={
                                            <div className={classes.accordionDetail}>
                                                <div className={classes.activityLeft}>
                                                    <div className={classes.detailItem}>
                                                        <p className={classes.labelTitle}>Materials :</p>
                                                        <p>{userPlaylists[index].materials[i]}</p>
                                                    </div>
                                                 </div>
                                                <div className={classes.activityRight}>
                                                    <div className={classes.detailItem}>
                                                        <p className={classes.labelTitle}>Objectives:</p>
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
                                                                    userPlaylists[index].links[i]
                                                                </Link> 
                                                            : <p>none</p>
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        buttonChildren={
                                            <button className={classes.removeButton} onClick={() => onRemoveActivity(userPlaylists[index].activity_ids[i], userPlaylists[index].activity_titles[i], userPlaylists[index].playlist_id, userPlaylists[index].playlist_title)} >
                                                <p><GoTrash /></p>
                                            </button>
                                        }
                                        color='grey'
                                    />
                                </li>
                            ))}  
                        </ul>
                    }
                    buttonChildren={
                        <div>
                                <button className={classes.plusButton} onClick={onAddActivity}>
                                    <p><MdAddCircle /></p>
                                </button>
                                <button className={classes.trashButton} onClick={() => onDeletePlaylist(list.playlist_id, list.playlist_title)}>
                                    <p><GoTrash /></p>
                                </button>
                        </div>
                    }
                />
    )

}

export default PlaylistItem;