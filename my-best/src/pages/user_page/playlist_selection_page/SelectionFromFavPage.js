import { Suspense } from "react";
import { defer, useRouteLoaderData, Await, json, redirect } from "react-router-dom";
import { getAuthToken } from "../../util/checkAuth";
import { loadUserFavorites } from "../UserFavoritesPage";
import SelectionForm from "../../../components/user_page/playlist_selection/SelectionForm";
import { API_URL } from "../../../App";

function SelectionFromFavPage(){
    const { data, playlist_id } = useRouteLoaderData('playlist-selecction-favorites');

    return (
        <>
            <Suspense fallback={<p style={{ textAlign: 'center' }}>Loading...</p>}>
                <Await resolve={data}>
                    {(loadedData) => <SelectionForm
                        data={loadedData.userFavorites} 
                        playlist_id={playlist_id} 
                        subTitle='Likes'
                        />
                    }
                </Await>
            </Suspense>
        </>
    )
}

export default SelectionFromFavPage;


export async function loader({ request, params }){
    const user_id = params.user_id;
    const playlist_id = parseInt(params.playlist_id);

    return defer({
        data: await loadUserFavorites(user_id),
        playlist_id: playlist_id
    })
}

export async function addActivityIntoPlaylistAction({ request }){
    const method = request.method;
    const token = getAuthToken();
    const formData = await request.formData();
    const user_id = formData.get("user_id");
    const playlist_id = formData.get("playlist_id");
    const list = formData.get("activity_id_list");
    const activity_id_arr = list.split(',').map(Number);

    const playlistData = {
        user_id: parseInt(user_id),
        playlist_id: parseInt(playlist_id),
        activity_id_arr
    }

    const response = await fetch(`${API_URL}/${user_id}/playlists/${playlist_id}`, {
        method: method,
        headers: {
            'Content-Type' : 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(playlistData)
    })
    

    if (response.status === 422 || response.status === 401) {
        return response;
    };

    if (!response.ok){
        throw json({ message: 'Could not save activity.'}, { status: 500 });
    }


    return redirect(`/mypage/${user_id}/playlists`);
}