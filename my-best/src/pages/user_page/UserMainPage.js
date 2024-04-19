import { json, defer, Await, useRouteLoaderData } from "react-router-dom";
import { Suspense } from "react";
import MyPage from '../../components/user_page/MyPage';
import { API_URL } from '../../App';
import { getAuthToken } from "../util/checkAuth";



function UserMainPage(){
    const { userProfileAndFav } = useRouteLoaderData('user-detail');
    console.log("userProfileAndFav:", userProfileAndFav);
    return (
        <>
            <Suspense fallback={<p style={{ textAlign: 'center' }}>Loading...</p>}>
                <Await resolve={userProfileAndFav}>
                    {(loadedData) => <MyPage userProfileAndFav={loadedData} />}
                </Await>
            </Suspense>
        </>
    )
};

export default UserMainPage;

async function loadUserDetail(id) {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/user/${id}`, {
        method: "GET",
        headers: {
            'Content-Type' : 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if(!response.ok) {
        throw json({message: "Could not fetch user detail."}, { status: 500})
    }

    const resData = await response.json();
    //console.log("resData:", resData)
    const userProfile = resData.userProfile;
    const userFavorites = resData.userFavorites
    console.log("userProfile:", userProfile);
    console.log("userFavorites:", userFavorites)
    return { userProfile, userFavorites };
}

export async function loader({ request, params }){
    const id = params.user_id;
    console.log("loader id", id);

    return defer({
        userProfileAndFav: await loadUserDetail(id),
    })
}

