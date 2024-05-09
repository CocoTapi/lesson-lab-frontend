import { json, defer, Await, useRouteLoaderData, redirect } from "react-router-dom";
import { Suspense } from "react";
import { API_URL } from '../../App';
import { getAuthToken } from "../util/checkAuth";
import Playlists from "../../components/user_page/Playlists";



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

async function loadUserPlaylists(id) {
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

    console.log("resData:", resData)
   
    const userPlaylists = resData.userPlaylists;
    const formattedActivityData = resData.formattedActivityData;
    
    console.log("userPlaylists:", userPlaylists);
    console.log("formattedActivityData: ", formattedActivityData);

    return { userPlaylists, formattedActivityData };
}

export async function loader({ request, params }){
    const id = params.user_id;
    console.log("loader id", id);

    return defer({
        data: await loadUserPlaylists(id),
    })
}

export async function action({ request }) {
    const token = getAuthToken();
    const method = request.method;
    const formData = await request.formData()
    const user_id = formData.get("user_id");

    let url = `${API_URL}/user/${user_id}/playlists`
    let bodyContent;

    //remove activity from playlist
    if (method === 'DELETE') {
        const activity_id = formData.get("activity_id");
        const playlist_id = formData.get("playlist_id");

        url = `${API_URL}/user/${user_id}/playlists/${playlist_id}`
    }

    //create new playlist
    if (method === 'POST') {
        const playlist_title = formData.get("playlist_title");

        bodyContent = JSON.stringify({ playlist_title: playlist_title}); 
    }

    //code here
    const response = await fetch(url, {
        method: request.method,
        headers: {
            "Authorization": `Bearer ${token}`
        },
        body: bodyContent
    });

    if (response.status === 422 || response.status === 401) {
        return response;
    };

    if(!response.ok) {
        throw json({message: "Could not remove favorite activity."}, { status: 500})
    }

    return redirect(`/mypage/${user_id}/playlists`);
}

