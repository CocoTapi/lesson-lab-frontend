import { json, defer, Await, useRouteLoaderData } from "react-router-dom";
import { Suspense } from "react";
import MyPage from '../../components/user_page/MyPage';
import { API_URL } from '../../App';



function UserMainPage(){
    const userDetail = useRouteLoaderData('user-detail');
    return (
        <>
            <Suspense fallback={<p style={{ textAlign: 'center' }}>Loading...</p>}>
                <Await resolve={userDetail}>
                    {(loadedData) => <MyPage usserDetail={loadedData} />}
                </Await>
            </Suspense>
        </>
    )
};

export default UserMainPage;

async function loadUserDetail(id) {
    const response = await fetch(`${API_URL}/user/` + id);

    if(!response.ok) {
        throw json({message: "Could not fetch user detail."}, { status: 500})
    }

    const resData = await response.json();
    //console.log('userDetail:', userDetail);
    return resData.userDetail;
}

export async function loader({ request, params }){
    const id = params.userId;
    console.log("loader id", id);

    return defer({
        userDetail: await loadUserDetail(id),
    })
}

