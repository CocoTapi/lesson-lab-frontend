import { Suspense } from "react";
import { defer, useRouteLoaderData, Await } from "react-router-dom";
import { getAuthToken } from "../../util/checkAuth";
import { loadUserFavorites } from "../UserFavoritesPage";
import SelectionFromFav from "../../../components/user_page/playlist_selection/SelectionFromFav";
function SelectionFromFavPage(){
    const { data, playlist_id } = useRouteLoaderData('playlist-selecction-favorites');

    console.log("data:", data);
    return (
        <>
            <Suspense fallback={<p style={{ textAlign: 'center' }}>Loading...</p>}>
                <Await resolve={data}>
                    {(loadedData) => <SelectionFromFav data={loadedData} playlist_id={playlist_id} />}
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