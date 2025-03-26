import { json, defer, Await, useRouteLoaderData } from "react-router-dom";
import { Suspense } from "react";
import { API_URL } from '../../App';
import { getAuthToken } from "../util/checkAuth";
import Profile from "../../components/user_page/Profile";



function UserMainPage(){
    const { data } = useRouteLoaderData('user-detail');
    return (
        <>
            <Suspense fallback={<p style={{ textAlign: 'center' }}>Loading...</p>}>
                <Await resolve={data}>
                    {(loadedData) => <Profile data={loadedData} />}
                </Await>
            </Suspense>
        </>
    )
};

export default UserMainPage;

async function loadUserDetail(id) {
    const token = getAuthToken();

    if(token) {
        const response = await fetch(`${API_URL}/user/${id}`, {
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
        const userProfile = resData.userProfile;
        //console.log("userProfile:", userProfile);
        return { userProfile };
    }

     // Guest user fallback
     const guestProfile = {
        user_id: 'guest'
     }
     return { userProfile: guestProfile}
    
}

export async function loader({ request, params }){
    const id = params.user_id;
    //console.log("loader id", id);

    return defer({
        data: await loadUserDetail(id),
    })
}


