import { useState, useEffect } from "react";
import { loadUserPlaylists } from "../../pages/user_page/UserPlaylistsPage";
import Modal from "../UI/Modal";
import PlaylistItem from "../user_page/PlaylistItem";
import classes from '../css/activities/PlaylistSelection.module.css'
import ButtonS from "../UI/ButtonS";
import { useNavigate } from "react-router-dom";
import TopButton from "../UI/TopButton";

function PlaylistSelection ({ user_id, token, onPlaylistSubmit, onClose }){
    const [userPlaylists, setUserPlaylists] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPlaylistData = async () => {
            const response = await loadUserPlaylists(user_id);
            setUserPlaylists(response.userPlaylists);
        };

        fetchPlaylistData();
    }, [user_id, token]);

    console.log("userPlaylists", userPlaylists);

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

    let content;
    if (Object.keys(userPlaylists).length === 0) {
        console.log("No playlist")
        content = <p>You haven't create playlists.</p>
    } else {
        content = userPlaylists.map((playlist) => (
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