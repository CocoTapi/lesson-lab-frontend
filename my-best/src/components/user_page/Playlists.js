import { useState, useRef, useEffect } from "react";
import { useSubmit, useRouteLoaderData, Link } from "react-router-dom";
import Accordion from "../UI/Accordion";
import { TiPlus } from "react-icons/ti";
import File from "../UI/File";
import SortBar from "../UI/SortBar";
import classes from '../css/user_page/Playlists.module.css';
import { FaStar } from "react-icons/fa";
import ButtonS from "../UI/ButtonS";
import PlaylistItem from "./PlaylistItem";
import ButtonM from "../UI/ButtonM";
import ActivitySelection from "./playlist_selection/ActivitySelection";


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
    const [ sortOption, setSortOption ] = useState('');
    const [ showPlaylistForm, setShowPlaylistForm] = useState(false);
    const titleRef = useRef('');
    const [ smallDisplay, setSmallDisplay] = useState(false);
    const [ showModal, setShowModal ] = useState(false);
    const initialModalInfo = {new_playlist_id: null, new_playlist_user_id: null, new_playlist_title: null};
    const [ modalInfo, setModalInfo ] = useState(initialModalInfo);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 640) {
                setSmallDisplay(true);
            } else {
                setSmallDisplay(false);
            }
        };

        handleResize();

        // Listen for resize events
        window.addEventListener('resize', handleResize);

        // Clean up
        return () => window.removeEventListener('resize', handleResize);
    }, []);


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

    const handleAddActivity = (playlist_id, user_id, playlist_title) => {
        console.log("clicked")
        setModalInfo({
            new_playlist_id: playlist_id,
            new_playlist_user_id: user_id,
            new_playlist_title: playlist_title
        })

        setShowModal(true);
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

    const sortedPlaylists = userPlaylists.sort((a, b) => {
        if (sortOption === 'shortToLong') {
            return a.total_duration - b.total_duration;
        } else if (sortOption === 'longToShort') {
            return b.total_duration - a.total_duration;
        } else if (sortOption === 'New') {
            return b.playlist_id - a.playlist_id;
        }

        return 0; // Default case if no sort option is matched
    });

    const handleSubmitPlaylistActivities = (arr, selected_user_id, selected_playlist_id) => {
        submit({ user_id: selected_user_id, playlist_id: selected_playlist_id, activity_id_list: arr}, { method: "PATCH"});
        setShowModal(false);
    }

    const handleCancel = () => {
        setModalInfo(initialModalInfo);
        setShowModal(false)
    }

    let content;
    if (Object.keys(userPlaylists).length === 0) {
        console.log("No playlist")
        content = <p>"You haven't create playlists."</p>
    } else {
        content = sortedPlaylists.map((playlist) => (
            <li key={playlist.playlist_id}>
                <PlaylistItem 
                    playlist={playlist}
                    onRemoveActivity={handleRemoveActivity}
                    onDeletePlaylist={handleDeletePlaylist}
                    onAddActivity={handleAddActivity}
                    displayPlusButton='true'
                />
            </li>
        ))       
    }


    return (
        <File> 
            {showModal && 
                <ActivitySelection 
                    title={modalInfo && modalInfo.new_playlist_title}
                    playlist_id={modalInfo && modalInfo.new_playlist_id}
                    user_id={modalInfo && modalInfo.new_playlist_user_id}
                    onSubmitActivities={handleSubmitPlaylistActivities}
                    onClose={handleCancel}
                />
            }
            <div className={classes.outerFrame}>
                <div className={classes.pageTitle}>
                    <h1>Playlists</h1>
                </div>
                <SortBar 
                    onSortChange={setSortOption} 
                    colorScheme="primaryLight"
                    defaultOptionName="--- select an option ---"
                    topRate="false"
                />
                <div  className={classes.addPlaylistBComponent}>
                    <ButtonM onClick={handleShowPlaylist} colorScheme='secondary'>
                        <TiPlus />
                        New Playlist
                    </ButtonM>
                </div>
                <div className={classes.bottomContents}>
                    <ul className={classes.bottomRight}>
                        {showPlaylistForm && 
                        <div className={classes.newPlaylistFormComponent}>
                            <Accordion 
                               headerTitle={
                                    <form className={classes.playlistForm} method="POST" onSubmit={handleSubmitNewPlaylist}>
                                        <div className={classes.formTitleComponent}>
                                            {smallDisplay && (
                                                <div className={classes.star} colorScheme='secondary'>
                                                    <FaStar />
                                                </div>
                                            )}
                                            <input 
                                                id='playlist_title' 
                                                type='text' 
                                                name='playlist_title'  
                                                placeholder="Playlist title"
                                                ref={titleRef}
                                            />
                                        </div>

                                        <div className={classes.formButton} >
                                            <ButtonS colorScheme="primary">
                                                <p>Create</p>
                                            </ButtonS>
                                        </div>
                                    </form>
                               } 
                               topImage={smallDisplay ? '' : (
                                <div className={classes.star} colorScheme='secondary'>
                                    <FaStar />
                                </div>
                               )
                            }
                            />
                            </div>
                        }
                        <h2 className={classes.itemCounts}>All Playlists : {sortedPlaylists.length} items</h2>
                        {content}
                    </ul>
                </div>
            </div>
        </File>
    )
       
}

export default Playlists;