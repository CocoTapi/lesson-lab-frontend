import { json, defer, Await, useRouteLoaderData, redirect } from "react-router-dom";
import { Suspense } from "react";
import { API_URL } from '../../App';
import { getAuthToken } from "../util/checkAuth";
import MyFavorites from "../../components/user_page/MyFavorites";



function UserFavoritesPage(){
    const { data } = useRouteLoaderData('user-favorites');
    console.log("data:", data);
    return (
        <>
            <Suspense fallback={<p style={{ textAlign: 'center' }}>Loading...</p>}>
                <Await resolve={data}>
                    {(loadedData) => <MyFavorites data={loadedData} />}
                </Await>
            </Suspense>
        </>
    )
};

export default UserFavoritesPage;

export async function loadUserFavorites(id) {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/user/${id}/favorites`, {
        method: "GET",
        headers: {
            'Content-Type' : 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (response.status === 422) throw new Response("", { status: 422 });
    if (response.status === 401) throw new Response("", { status: 401 });

    if(!response.ok) {
        throw json({message: "Could not fetch user detail."}, { status: 500})
    }

    const resData = await response.json();
    //console.log("resData:", resData)
   
    const userFavorites = resData.userFavorites
    
    //console.log("userFavorites:", userFavorites)
    return { userFavorites };
}

export async function loader({ request, params }){
    const id = params.user_id;
    console.log("loader id", id);

    return defer({
        data: await loadUserFavorites(id),
    })
}

export async function action({ request }) {
    const method = request.method;
    const formData = await request.formData()
    const activity_id = formData.get("activity_id");
    const user_id = formData.get("user_id");
    const token = getAuthToken();

    // console.log("request:", formData);
    // console.log("user_id:", user_id);
    // console.log("activity_id", activity_id);
    // console.log("method", method)

    //code here
    const response = await fetch(`${API_URL}/user/${user_id}/favorites/${activity_id}`, {
        method: request.method,
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (response.status === 422) throw new Response("", { status: 422 });
    if (response.status === 401) throw new Response("", { status: 401 });


    if(!response.ok) {
        throw json({message: "Could not remove favorite activity."}, { status: 500})
    }

    return redirect(`/mypage/${user_id}/favorites`);
}

