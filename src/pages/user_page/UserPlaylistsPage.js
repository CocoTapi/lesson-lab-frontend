import { json, defer, Await, useRouteLoaderData, redirect } from "react-router-dom";
import { Suspense } from "react";
import { API_URL, baseUrl } from '../../App';
import { getAuthToken } from "../util/checkAuth";
import Playlists from "../../components/user_page/Playlists";

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
    const response = await fetch(`${API_URL}/user/${id}/playlists`, {
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
   
    const userPlaylists = resData.userPlaylists;

    return { userPlaylists };
}

export async function userPlaylistsLoader({ request, params }){
    const id = params.user_id;
    //console.log("loader id", id);

    return defer({
        data: await loadUserPlaylists(id),
    })
}

export async function action({ request }) {

    const token = getAuthToken();
    const method = request.method;
    const formData = await request.formData()
    const user_id = parseInt(formData.get("user_id"));
    const playlist_id = parseInt(formData.get("playlist_id")) || null;

    let url = `${API_URL}/user/${user_id}/playlists`
    let bodyContent;

    //----- NOT require refresh after the response -----

    //delete playlist 
    if (method === 'DELETE' &&! formData.get("activity_id") ) {
        bodyContent = { playlist_id };

        await handleRequest(url, method, token, bodyContent, user_id);
        return redirect(`/mypage/${user_id}/playlists`);
    }

    //update playlist: reorder activity 
    if (method === 'PATCH' && !formData.get("activity_id") && !formData.get("activity_id_list")){
        const list = formData.get('orderUpdate');
        const orderUpdate = list.split(',').map(Number);

        //console.log("orderUpdate:", orderUpdate);

        bodyContent = {
            playlist_id,
            reorderedActivities: orderUpdate
        }

        url = `${API_URL}/user/${user_id}/playlists/${playlist_id}`

        await handleRequest(url, method, token, bodyContent, user_id);
        return redirect(`/mypage/${user_id}/playlists`);
    }

    //create new playlist
    if (method === 'POST') {
        const playlist_title = formData.get("playlist_title");

        bodyContent = { playlist_title: playlist_title}; 

        await handleRequest(url, method, token, bodyContent, user_id);
        return redirect(`/mypage/${user_id}/playlists`);
    }

    


    //----- require refresh after the response -----

    //remove activity from playlist 
    if (method === 'DELETE' && formData.get("activity_id")) {
        const activity_id = parseInt(formData.get("activity_id"));
        console.log("start deleting", playlist_id, activity_id)

        bodyContent = { 
            playlist_id,
            activity_id 
        };

        url = `${API_URL}/user/${user_id}/playlists/${playlist_id}`

        await handleRequest(url, method, token, bodyContent, user_id);
        return handlePageRefresh(user_id);
    } 

    //add activities into playlist | require refresh
    if(method === 'PATCH' && !formData.get("activity_id") && !formData.get('orderUpdate')){
        const list = formData.get("activity_id_list");
        const activity_id_arr = list.split(',').map(Number);

        bodyContent = {
            playlist_id,
            activity_id_arr
        }

        url = `${API_URL}/user/${user_id}/playlists/${playlist_id}`

        await handleRequest(url, method, token, bodyContent, user_id);
        return handlePageRefresh(user_id);    
    }

}

async function handleRequest(url, method, token, bodyContent, user_id) {
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
    const redirectUrl = `${baseUrl}/full-stack-project-frontend/mypage/${user_id}/playlists`;
    window.location.href = redirectUrl;
    return null;
}

