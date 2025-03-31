import { defer, Await, useRouteLoaderData } from "react-router-dom";
import { Suspense } from "react";
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
    
     // Guest user fallback
     const guestProfile = {
        user_id: 'guest'
     }
     return { userProfile: guestProfile}
    
}

export async function loader({ request, params }){
    const id = params.user_id;

    return defer({
        data: await loadUserDetail(id),
    })
}


