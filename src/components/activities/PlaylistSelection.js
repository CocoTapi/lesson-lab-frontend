import { useState, useEffect, useMemo } from "react";
import { loadUserPlaylists } from "../../pages/user_page/UserPlaylistsPage";
import Modal from "../UI/Modal";
import PlaylistItem from "../user_page/PlaylistItem";
import classes from '../css/activities/PlaylistSelection.module.css'
import ButtonS from "../UI/ButtonS";
import TopButton from "../UI/TopButton";
import ButtonM from "../UI/ButtonM";
import { Link } from "react-router-dom";

// Select playlist from Activity Item
function PlaylistSelection ({ user_id, token, onPlaylistSubmit, onClose, current_activity_id, onCreatePlaylist }){
    const [userPlaylists, setUserPlaylists] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState();

    useEffect(() => {
        const fetchPlaylistData = async () => {
           
            const response = await loadUserPlaylists(user_id);
            const list = response.userPlaylists;
           
            setUserPlaylists(list);
        };

        fetchPlaylistData();
    }, [user_id, token]);


    const handlePlaylistChange = (event) => {
        setSelectedPlaylist(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (selectedPlaylist) {
            onPlaylistSubmit(selectedPlaylist);
        } else {
            onClose();
        }
    }

    const handleCreatePlaylist = () => {
        onCreatePlaylist();
        onClose();
    }


    //Update userPlaylists after refetching playlist data 
    const availablePlaylists = useMemo(() => {
        if (userPlaylists.length === 0) {
            return []; // Return empty array if not loaded yet
        }

        return userPlaylists.filter(playlist =>
            // Display only playlists that have no current activity
            !playlist.activity_ids.includes(current_activity_id)
        );
    }, [userPlaylists, current_activity_id]);

    let content;
    if (availablePlaylists && Object.keys(availablePlaylists).length === 0) {
        content = (
            <div>
                <p>No playlist available.</p>
            </div>
        )
    } else if (availablePlaylists) {
        content = availablePlaylists.map((playlist) => (
            <label key={playlist.playlist_id} className={classes.radioContainer}>
                <input
                    type="radio"
                    name="playlist"
                    value={playlist.playlist_id}
                    onChange={handlePlaylistChange}
                    className={classes.customRadio}
                />
                <div className={classes.playlistItem}>
                    <PlaylistItem 
                        playlist={playlist}
                        displayPlusButton='false'
                        showChangeOrderButton='false'
                    />
                </div>
            </label>
        ))       
    }

    return (
        <Modal>
            <div className={classes.modalContents}>
                <div className={classes.topButtonComponent}>
                    <TopButton onClick={onClose} >Back</TopButton>
                    <TopButton onClick={handleSubmit} >Done</TopButton>
                </div>
                <form onSubmit={handleSubmit}>
                    <h2>Select playlist you want to add the activity</h2>
                    <div className={classes.playlistRadio}>
                        {content}
                    </div>
                    <div className={classes.createPlaylistButtonComponent}>
                        {user_id === 'guest' ?                           
                        (   <ButtonM onClick={handleCreatePlaylist}>
                                Create Playlist & Add
                            </ButtonM>
                        ) : (
                            <Link to={`../../mypage/${user_id}/playlists`} >
                                <p>Do you want to create a new playlist first?</p>
                            </Link>
                        )}
                    </div>
                    <div className={classes.bottomSubmitButton}>
                        <ButtonS colorScheme="primary">Done</ButtonS> :
                    </div>
                </form>
            </div>
            
        </Modal>
    )
}

export default PlaylistSelection;