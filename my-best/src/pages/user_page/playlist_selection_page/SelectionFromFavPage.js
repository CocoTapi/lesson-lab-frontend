import { Suspense } from "react";
import { defer, useRouteLoaderData, Await } from "react-router-dom";
import { getAuthToken } from "../../util/checkAuth";
import { loadUserFavorites } from "../UserFavoritesPage";
import SelectionForm from "../../../components/user_page/playlist_selection/SelectionForm";

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
    const formData = await request.formData();
    const activity_id_list = formData.get("activity_id_list");
    const user_id = formData.get("user_id");
    const playlist_id = formData.get("playlist_id");
    const token = getAuthToken();


    console.log(activity_id_list);
}