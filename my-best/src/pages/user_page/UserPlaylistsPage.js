import { json, defer, Await, useRouteLoaderData, redirect } from "react-router-dom";
import { Suspense } from "react";
import { API_URL } from '../../App';
import { getAuthToken } from "../util/checkAuth";
import Playlists from "../../components/user_page/Playlists";



function UserPlaylistsPage(){
    //const { data } = useRouteLoaderData('user-playlists');
    return (
        <div><Playlists /></div>
        // <>
        //     <Suspense fallback={<p style={{ textAlign: 'center' }}>Loading...</p>}>
        //         <Await resolve={data}>
        //             {(loadedData) => <Playlists data={loadedData} />}
        //         </Await>
        //     </Suspense>
        // </>
    )
};

export default UserPlaylistsPage;

async function loadUserPlaylists(id) {
    const token = getAuthToken();
    // const response = await fetch(`${API_URL}/user/${id}/favorites`, {
    //     method: "GET",
    //     headers: {
    //         'Content-Type' : 'application/json',
    //         'Authorization': `Bearer ${token}`
    //     }
    // });

    // if(!response.ok) {
    //     throw json({message: "Could not fetch user playlists."}, { status: 500})
    // }

    // const resData = await response.json();
    // //console.log("resData:", resData)
   
    // const userFavorites = resData.userFavorites
    
    // console.log("userFavorites:", userFavorites)
    // return { userPlaylists };
}

export async function loader({ request, params }){
    const id = params.user_id;
    console.log("loader id", id);

    return defer({
        data: await loadUserPlaylists(id),
    })
}

export async function action({ request }) {
    const method = request.method;
    const formData = await request.formData()
    const activity_id = formData.get("activity_id");
    const user_id = formData.get("user_id");
    const token = getAuthToken();

    console.log("request:", formData);
    console.log("user_id:", user_id);
    console.log("activity_id", activity_id);
    console.log("method", method)

    //code here
    const response = await fetch(`${API_URL}/user/${user_id}/favorites/${activity_id}`, {
        method: request.method,
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if(!response.ok) {
        throw json({message: "Could not remove favorite activity."}, { status: 500})
    }

    return redirect(`/mypage/${user_id}/favorites`);
}

