import { json, defer, Await, useRouteLoaderData, redirect } from "react-router-dom";
import { Suspense } from "react";
import { API_URL, baseName, baseUrl } from '../../App';
import { getAuthToken } from "../util/checkAuth";
import Playlists from "../../components/user_page/Playlists";
import { addActivitiesToPlaylist, fetchGuestPlaylist, removeActivityFromPlaylist, removeGuestPlaylist, reorderPlaylist, saveNewGuestPlaylist } from "../util/saveGuestData";
import Swal from 'sweetalert2';

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
    const token = getAuthToken();
    let user_id = id;
    if(user_id !== 'guest') user_id = parseInt(id);
    let userPlaylists;

    if(token && user_id !== 'guest') {
        const response = await fetch(`${API_URL}/user/${user_id}/playlists`, {
            method: "GET",
            headers: {
                'Content-Type' : 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
    
        if(!response.ok) {
            throw json({message: "Could not fetch user playlists."}, { status: 500})
        }
    
        const resData = await response.json();
       
        userPlaylists = resData.userPlaylists;
        
    } else if (user_id === 'guest') {
        userPlaylists = await fetchGuestPlaylist()
    }
    return { userPlaylists };
}

export async function userPlaylistsLoader({ request, params }){
    const id = params.user_id;

    return defer({
        data: await loadUserPlaylists(id),
    })
}

export async function action({ request }) {
    const token = getAuthToken();
    const method = request.method;
    const formData = await request.formData()
    let user_id = formData.get("user_id")
    if (user_id !== 'guest') parseInt(user_id);
    const playlist_id = parseInt(formData.get("playlist_id")) || null;

    let url = `${API_URL}/user/${user_id}/playlists`
    let bodyContent;

    //----- NOT require refresh after the response -----

    //delete playlist 
    if (method === 'DELETE' && !formData.get("activity_id") ) {
        bodyContent = { playlist_id };
        if (token && user_id !== 'guest') {
            await handleRequest(url, method, token, bodyContent, user_id);

        } else if (user_id === 'guest') {
            await removeGuestPlaylist(playlist_id);
        }

        return redirect(`/mypage/${user_id}/playlists`);
    }

    //update playlist: reorder activity 
    if (method === 'PATCH' && !formData.get("activity_id") && !formData.get("activity_id_list")){
        const list = formData.get('orderUpdate');
        const orderUpdate = list.split(',').map(Number);

        if (!Array.isArray(orderUpdate) || orderUpdate.some(id => typeof id !== 'number')) {
            throw new Error('Invalid reorder data');
        }

        if (token && user_id !== 'guest') {
            bodyContent = {
                playlist_id,
                reorderedActivities: orderUpdate
            }
    
            url = `${API_URL}/user/${user_id}/playlists/${playlist_id}`
    
            await handleRequest(url, method, token, bodyContent, user_id);

        } else if (user_id === 'guest')  {
            await reorderPlaylist(playlist_id, orderUpdate)
        }
        
        return redirect(`/mypage/${user_id}/playlists`);
    }

    //create new playlist
    if (method === 'POST') {
        const playlist_title = formData.get("playlist_title");
        if (token && user_id !== 'guest') {
            bodyContent = { playlist_title }; 

            await handleRequest(url, method, token, bodyContent, user_id);

        } else if (user_id === 'guest') {
            const newPlaylist = await saveNewGuestPlaylist(playlist_title);

            if(newPlaylist) {
                Swal.fire({
                    title: "Success!",
                    icon: "success",
                    draggable: true,
                    confirmButtonColor: '#315079'
                    });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong. Please try again later.",
                    footer: '<a href="#">Why do I have this issue?</a>'
                    });   
            }
        }
       
        return redirect(`/mypage/${user_id}/playlists`);
    }

    


    //----- require refresh after the response -----

    //remove activity from playlist 
    if (method === 'DELETE' && formData.get("activity_id")) {
        const activity_id = parseInt(formData.get("activity_id"));

        if(token && user_id !== 'guest') {
            bodyContent = { 
                playlist_id,
                activity_id 
            };
    
            url = `${API_URL}/user/${user_id}/playlists/${playlist_id}`
            await handleRequest(url, method, token, bodyContent, user_id);

        } else if (user_id === 'guest')  {
            const duration = formData.get('activityDuration');
            await removeActivityFromPlaylist(playlist_id, activity_id, duration);
        }
       
        // TODO: Check this refresh function
        // return handlePageRefresh(user_id);
        return null;
    } 

    //add activities into playlist | require refresh
    if(method === 'PATCH' && !formData.get("activity_id") && !formData.get('orderUpdate')){
        const list = formData.get("activity_id_list");
        const activity_id_arr = list.split(',').map(Number);

        if (token && user_id !== 'guest') {
            bodyContent = {
                playlist_id,
                activity_id_arr
            }
    
            url = `${API_URL}/user/${user_id}/playlists/${playlist_id}`
    
            await handleRequest(url, method, token, bodyContent, user_id);

        } else if (user_id === 'guest')  {
            const durations = formData.get('playlistDuration');
            await addActivitiesToPlaylist(playlist_id, activity_id_arr, durations);
        }
        
        // return handlePageRefresh(user_id);  
        return null;  
    }

}

export async function handleRequest(url, method, token, bodyContent, user_id) {
    const response = await fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(bodyContent)
    });

    if (response.status === 422) throw new Response("", { status: 422 });
    if (response.status === 401) throw new Response("", { status: 401 });

    if (!response.ok) {
        throw json({ message: "Could not complete the request." }, { status: 500 });
    }
}


function handlePageRefresh(user_id) {
    console.log("baseUrl:", baseUrl);

    const redirectUrl = `${baseUrl}${baseName}/mypage/${user_id}/playlists`;

    console.log("Redirecting to:", redirectUrl);
    
    window.location.href = redirectUrl;
    return null;
}

