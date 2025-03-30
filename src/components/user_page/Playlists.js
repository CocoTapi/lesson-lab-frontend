import { useState, useRef, useEffect } from "react";
import { useSubmit, useRouteLoaderData } from "react-router-dom";
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
import Swal from "sweetalert2";
import { swalError } from "../../pages/util/swalModal";

// TODO: change add playlist form style from accordion to normal
// TODO: check if the title is empty or not
// TODO: add a message when the playlist is empty
// TODO: add boarder for sort bar for playlist

function Playlists ({ data }) {
    const userPlaylists = data.userPlaylists;
    const user = useRouteLoaderData('root');
    const user_id = user ? user.user_id : 'guest';
    const submit = useSubmit();
    const [ sortOption, setSortOption ] = useState('');
    const [ showPlaylistForm, setShowPlaylistForm] = useState(false);
    const titleRef = useRef('');
    const [ smallDisplay, setSmallDisplay] = useState(false);
    const [ showModal, setShowModal ] = useState(false);
    const initialModalInfo = {
        selected_playlist_id: null, 
        selected_playlist_user_id: null, 
        selected_playlist_title: null,
        current_playlist_activity_ids: null
    };
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


    const handleRemoveActivity = (activity_id, activity_title, playlist_id, playlist_title, activityDuration) => {
         Swal.fire({
            title: "Are you sure?",
            text: `Do you want to remove this activity"?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ff9603",
            cancelButtonColor: "#55555",
            confirmButtonText: "Yes, remove it!"
          }).then((result) => {
            if (result.isConfirmed) {
                submit({ activity_id, user_id, playlist_id, activityDuration}, { method: "DELETE" });
            }
          });
    };
    
    const handleDeletePlaylist = (playlist_id, playlist_title) => {
        Swal.fire({
            title: "Are you sure?",
            text: `Do you want to delete this playlist"?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ff9603",
            cancelButtonColor: "#55555",
            confirmButtonText: "Yes, delete it!",
          },
        ).then((result) => {
            if (result.isConfirmed) {
                submit({ user_id, playlist_id }, { method: "DELETE" });
            }
          });
    }

    const handleAddActivity = (playlist_id, playlist_title, activity_ids) => {
        
        if (!user_id | !playlist_id | !playlist_title | !activity_ids) {
            swalError();
            setShowModal(false);
        } else {
            setModalInfo({
                selected_playlist_id: playlist_id,
                selected_playlist_user_id: user_id,
                selected_playlist_title: playlist_title,
                current_playlist_activity_ids: activity_ids
            })
    
            setShowModal(true);
        }
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

    const handleSubmitPlaylistActivities = (arr, user_id, playlist_id, playlistDuration) => {
        submit({ user_id, playlist_id, activity_id_list: arr, playlistDuration}, { method: "PATCH"});
        setShowModal(false);
    }

    const handleCancel = () => {
        setModalInfo(initialModalInfo);
        setShowModal(false)
    }

    const handleSaveOrder = (playlist_id, orderUpdate) => {
        submit({ user_id, playlist_id, orderUpdate}, { method: "PATCH"});
    }

    let content;
    if (Object.keys(userPlaylists).length === 0) {
        content = <p>You haven't created playlists yet.</p>
    } else {
        content = sortedPlaylists.map((playlist) => (
            <li key={`${playlist.total_duration}-${playlist.playlist_id}`}>
                <PlaylistItem 
                    playlist={playlist}
                    onRemoveActivity={handleRemoveActivity}
                    onDeletePlaylist={handleDeletePlaylist}
                    onAddActivity={handleAddActivity}
                    playlistButtons='true'
                    activityButtons='true'
                    saveOrder={handleSaveOrder}
                />
            </li>
        ))       
    }


    return (
        <File> 
            {showModal && 
                <ActivitySelection 
                    title={modalInfo && modalInfo.selected_playlist_title}
                    playlist_id={modalInfo && modalInfo.selected_playlist_id}
                    user_id={modalInfo && modalInfo.selected_playlist_user_id}
                    current_activity_ids={modalInfo.current_playlist_activity_ids}
                    onSubmitActivities={handleSubmitPlaylistActivities}
                    onClose={handleCancel}
                />
            }
            <div className={classes.outerFrame}>
                <div className={classes.pageTitle}>
                    <h1>Playlists</h1>
                </div>
                <div  className={classes.addPlaylistBComponent}>
                    <ButtonM onClick={handleShowPlaylist} colorScheme='secondary'>
                        <TiPlus />
                        Add Playlist
                    </ButtonM>
                </div>
                <SortBar 
                    onSortChange={setSortOption} 
                    colorScheme="primaryLight"
                    defaultOptionName="--- select an option ---"
                    topRate="false"
                />
              
                <div className={classes.bottomContents}>
                    <ul className={classes.bottomRight}>

                        {/* form to add a new playlist */}
                        {showPlaylistForm && 
                            <div className={classes.newPlaylistFormComponent}>
                                <Accordion 
                                headerTitle={
                                        <form className={classes.playlistForm} method="POST" onSubmit={handleSubmitNewPlaylist}>
                                            <div className={classes.formTitleComponent}>
                                                {smallDisplay && (
                                                    <div className={classes.star}>
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
                                    <div className={classes.star} >
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