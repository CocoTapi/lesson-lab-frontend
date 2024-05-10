import { useState, useRef } from "react";
import { useSubmit, useRouteLoaderData, Link } from "react-router-dom";
import Accordion from "../UI/Accordion";
import { TiPlus } from "react-icons/ti";
import File from "../UI/File";
import SortBar from "../UI/SortBar";
import Filter from "../UI/Filter";
import classes from '../css/user_page/Playlists.module.css';
import { FaStar } from "react-icons/fa";
import { MdAddCircle } from "react-icons/md";
import ButtonS from "../UI/ButtonS";
import { GoTrash } from "react-icons/go";

function Playlists ({ data }) {
    const userPlaylists = data.userPlaylists;
    //const formattedActivityData = data.uformattedActivityData;
    const user = useRouteLoaderData('root');
    let token;
    let user_name;
    let user_id;
    if(user) {
        token = user.token;
        user_name = user.user_name
        user_id = user.user_id;
    }
    const submit = useSubmit();
    const [ sortOption, setSortOption ] = useState('shortToLong');
    const [ showPlaylistForm, setShowPlaylistForm] = useState(false);
    const titleRef = useRef('');
    //TODO: sort 

    const handleRemoveActivity = (activity_id, activity_title, playlist_id, playlist_title) => {
        const proceed = window.confirm(`Are you sure you want to remove ${activity_title} in your playlist, ${playlist_title}?`);
    
        if (proceed) {
            submit({ activity_id, user_id, playlist_id}, { method: "PATCH" });
        }
    };
    
    const handleDeletePlaylist = (playlist_id, playlist_title) => {
        const proceed = window.confirm(`Are you sure you want to delete ${playlist_title}?`);
    
        if (proceed) {
            submit({ user_id, playlist_id }, { method: "DELETE" });
        }
    }

    const handleAddActivity = (e) => {
        e.preventDefault();
        console.log("add activity!")
        //TODO:
    }

    const handleShowPlaylist = (e) => {
        e.preventDefault();
        setShowPlaylistForm(!showPlaylistForm);
    }


    const handleSubmitNewPlaylist = (e) => {
        e.preventDefault();
        const title = titleRef.current.value;
        
        submit({ user_id, playlist_title: title }, { method: "POST" });

        setShowPlaylistForm(false);
    }

    let content;
    if (Object.keys(userPlaylists).length === 0) {
        console.log("No content")
        content = <p>"You haven't create playlists."</p>
    } else {
        content = userPlaylists.map((list, index) => (
            <li key={list.playlist_id}>
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
                                            <button className={classes.removeButton} onClick={() => handleRemoveActivity(userPlaylists[index].activity_ids[i], userPlaylists[index].activity_titles[i], userPlaylists[index].playlist_id, userPlaylists[index].playlist_title)} >
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
                                <button className={classes.plusButton} onClick={handleAddActivity}>
                                    <p><MdAddCircle /></p>
                                </button>
                                <button className={classes.plusButton} onClick={() => handleDeletePlaylist(list.playlist_id, list.playlist_title)}>
                                    <p><GoTrash /></p>
                                </button>
                        </div>
                    }
                />
            </li>
        ))       
    }


    return (
        <File> 
            <div className={classes.frame}>
                <div className={classes.sortBar}>
                    <SortBar 
                        onSortChange={setSortOption} 
                        colorScheme="primaryLight"
                        button='ButtonM'
                        icon={<TiPlus />}
                        buttonWord='Add Playlist'
                        onClick={handleShowPlaylist}
                        buttonColor='secondary'
                    />
                </div>
                <div className={classes.contents}>
                    <div className={classes.left}>
                        <div className={classes.filter}>
                            <Filter />
                        </div>
                    </div>
                    <ul className={classes.right}>
                        {content}
                        {showPlaylistForm && 
                            <Accordion 
                               headerTitle={
                                    <form className={classes.playlistForm} method="POST" onSubmit={handleSubmitNewPlaylist}>
                                        <input 
                                            id='playlist_title' 
                                            type='text' 
                                            name='playlist_title'  
                                            placeholder="Playlist title"
                                            ref={titleRef}
                                        />

                                        <div className={classes.formButton} >
                                            <ButtonS colorScheme="primary">
                                                <p>Create</p>
                                            </ButtonS>
                                        </div>
                                    </form>
                               } 
                               topImage={
                                <div className={classes.sum}>
                                    <p><FaStar /></p>
                                </div>
                            }
                            />
                        }
                       
                    </ul>
                </div>
            </div>
        </File>
    )
       
}

export default Playlists;