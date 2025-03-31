import { defer, Await, useRouteLoaderData, redirect } from "react-router-dom";
import { Suspense } from "react";
import Playlists from "../../components/user_page/Playlists";
import { addActivitiesToPlaylist, fetchGuestPlaylist, removeActivityFromPlaylist, removeGuestPlaylist, reorderPlaylist, saveNewGuestPlaylist } from "../util/saveGuestData";
import { swalError, swalSuccess } from "../util/swalModal";

//TODO: re-fetch data after adding activities into playlist

function UserPlaylistsPage(){
    const { data } = useRouteLoaderData('user-playlists');

    return (
        <>
            <Suspense fallback={<p style={{ textAlign: 'center' }}>Loading...</p>}>
                <Await resolve={data}>
                    {(loadedData) => <Playlists data={loadedData} />}
                </Await>
            </Suspense>
        </>
    )
};

export default UserPlaylistsPage;



export async function loadUserPlaylists(id) {
   
    const userPlaylists = await fetchGuestPlaylist();
  
    return { userPlaylists };
}

export async function userPlaylistsLoader({ request, params }){
    const id = params.user_id;

    return defer({
        data: await loadUserPlaylists(id),
    })
}

export async function action({ request }) {
    const method = request.method;
    const formData = await request.formData()
    let user_id = formData.get("user_id")
    if (user_id !== 'guest') parseInt(user_id);
    const playlist_id = parseInt(formData.get("playlist_id")) || null;


    //----- NOT require refresh after the response -----

    //delete entire playlist 
    if (method === 'DELETE' && !formData.get("activity_id") ) {
        
        const isDeleted = await removeGuestPlaylist(playlist_id);

        if(!isDeleted) swalError();

        return redirect(`/mypage/${user_id}/playlists`);
    }

    //update playlist: reorder activity 
    if (method === 'PATCH' && !formData.get("activity_id") && !formData.get("activity_id_list")){
        const list = formData.get('orderUpdate');
        const orderUpdate = list.split(',').map(Number);

        // check validity
        if (
            !Array.isArray(orderUpdate) || 
            orderUpdate.some(id => typeof id !== 'number')
        ) {
            swalError();
        }

        const isReordered = await reorderPlaylist(playlist_id, orderUpdate)

        if(!isReordered) swalError();
       
        
        return redirect(`/mypage/${user_id}/playlists`);
    }

    //create new playlist
    if (method === 'POST') {
        const playlist_title = formData.get("playlist_title");
      
        const newPlaylist = await saveNewGuestPlaylist(playlist_title);

        if(newPlaylist) {
            swalSuccess();
        } else {
            swalError();
        }
      
       
        return redirect(`/mypage/${user_id}/playlists`);
    }

    


    //----- require refresh after the response -----

    // Have to return null 



    //remove activity from playlist 
    if (method === 'DELETE' && formData.get("activity_id")) {
        const activity_id = parseInt(formData.get("activity_id"));

        const duration = formData.get('activityDuration');
        const isRemoved = await removeActivityFromPlaylist(playlist_id, activity_id, duration);

        if (!isRemoved) swalError();
  
    
        return null;
    } 

    //add activities into playlist | require refresh
    if(method === 'PATCH' && !formData.get("activity_id") && !formData.get('orderUpdate')){
        const list = formData.get("activity_id_list");
        const activity_id_arr = list.split(',').map(Number);

        const durations = parseInt(formData.get('selectedDurationTotal'));

        if (durations === 0 || activity_id_arr.length === 0 || !playlist_id) {
            swalError();
        }

        const response = await addActivitiesToPlaylist(playlist_id, activity_id_arr, durations);
    
        if(!response) {
            swalError();
        } else {
            swalSuccess();
        }
       
        return null;  
    }

}

