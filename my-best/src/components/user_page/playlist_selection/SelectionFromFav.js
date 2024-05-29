import { useState, useEffect, useRef } from "react";
import { useRouteLoaderData, useSubmit, Link } from "react-router-dom";
import classes from '../../css/user_page/SelectionFromFav.module.css';
import File from "../../UI/File";
import Accordion from "../../UI/Accordion";
import { FaStar } from "react-icons/fa";


function SelectionFromFav({ data, playlist_id}){
    const userFavorites = data.userFavorites;
    const userPlaylistsData = useRouteLoaderData('user-playlists');
    const playlist = userPlaylistsData.data.userPlaylists.filter(playlist => playlist.playlist_id === playlist_id)[0];
    const [ smallDisplay, setSmallDisplay] = useState(false);
    const titleRef = useRef('');


    
    console.log("userFavorites, selection", userFavorites);
    console.log("playlist, selection", playlist);
    console.log("selectedPlaylist", playlist_id);

    const user = useRouteLoaderData('root');
    let token;
    let user_name;
    let user_id;
    if(user) {
        token = user.token;
        user_name = user.user_name
        user_id = user.user_id;
    }

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
    

    return (
        <File>
            <div className={classes.outerFrame}>
                <div className={classes.pageTitle}>
                    <h1>Edit Playlists</h1>
                </div>
                <div className={classes.newPlaylistFormComponent}>
                            <Accordion 
                               headerTitle={
                                    <form className={classes.playlistForm} method="PATCH">
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

               
        
                
               
                 


                  
            </div>
       
        </File>
    )
}

export default SelectionFromFav;