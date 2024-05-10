import { useState, useRef } from "react";
import { useSubmit, useRouteLoaderData, Link } from "react-router-dom";
import Accordion from "../UI/Accordion";
import { TiPlus } from "react-icons/ti";
import File from "../UI/File";
import SortBar from "../UI/SortBar";
import Filter from "../UI/Filter";
import classes from '../css/user_page/Playlists.module.css';
import { FaStar } from "react-icons/fa";
import ButtonS from "../UI/ButtonS";
import PlaylistItem from "./PlaylistItem";

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
                <PlaylistItem 
                    list={list}
                    index={index}
                    userPlaylists={userPlaylists}
                    onRemoveActivity={handleRemoveActivity}
                    onDeletePlaylist={handleDeletePlaylist}
                    onAddActivity={handleAddActivity}

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