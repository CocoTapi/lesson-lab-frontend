import { json, defer, Await, useRouteLoaderData } from "react-router-dom";
import { Suspense } from "react";
import MyPage from '../../components/user_page/MyPage';
import { API_URL } from '../../App';



function UserMainPage(){
    const { userDetail } = useRouteLoaderData('user-detail');
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
    //const response = await fetch(`${API_URL}/user/` + id);

    // if(!response.ok) {
    //     throw json({message: "Could not fetch user detail."}, { status: 500})
    // }

    // const resData = await response.json();
    //const userDetail = resData.activity[0];
    return {}
}

export async function loader({ request, params }){
    const id = params.user_id;

    return defer({
        userDetail: await loadUserDetail(id),
    })
}

