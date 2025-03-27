import { useState, useEffect } from "react";
import { loadUserPlaylists } from "../../pages/user_page/UserPlaylistsPage";
import Modal from "../UI/Modal";
import PlaylistItem from "../user_page/PlaylistItem";
import classes from '../css/activities/PlaylistSelection.module.css'
import ButtonS from "../UI/ButtonS";
import TopButton from "../UI/TopButton";
import { fetchGuestPlaylist } from "../../pages/util/saveGuestData";

function PlaylistSelection ({ user_id, token, onPlaylistSubmit, onClose, current_activity_id }){
    const [userPlaylists, setUserPlaylists] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState();

    useEffect(() => {
        const fetchPlaylistData = async () => {
            let list;
            if (user_id !== 'guest'){
                const response = await loadUserPlaylists(user_id);
                list = response.userPlaylists;
            } else {
                list = fetchGuestPlaylist();
            }
           
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

    const availablePlaylists = userPlaylists.filter(playlist => !playlist.activity_ids.includes(current_activity_id));

    let content;
    if (Object.keys(availablePlaylists).length === 0) {
        content = (
            <div>
                <p>No playlist available.</p>
                {/* TODO: Add playlist form  */}
            </div>
        )
    } else {
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
                    <div className={classes.bottomSubmitButton}>
                        <ButtonS colorScheme="primary">Done</ButtonS>
                    </div>
                </form>
            </div>
            
        </Modal>
    )
}

export default PlaylistSelection;