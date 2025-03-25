import { json, defer, Await, useRouteLoaderData, redirect } from "react-router-dom";
import { Suspense } from "react";
import { API_URL } from '../../App';
import { getAuthToken } from "../util/checkAuth";
import MyUploads from "../../components/user_page/MyUploads";



function UserUploads(){
    const { data } = useRouteLoaderData('user-uploads');
    
    return (
        <>
            <Suspense fallback={<p style={{ textAlign: 'center' }}>Loading...</p>}>
                <Await resolve={data}>
                    {(loadedData) => <MyUploads data={loadedData} />}
                </Await>
            </Suspense>
        </>
    )
};

export default UserUploads;  

export async function loadUserUploads(id) {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/user/${id}/uploads`, {
        method: "GET",
        headers: {
            'Content-Type' : 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (response.status === 422) throw new Response("", { status: 422 });
    if (response.status === 401) throw new Response("", { status: 401 });
   
    if(!response.ok) {
        throw json({message: "Could not fetch user uploads."}, { status: 500})
    }

    const resData = await response.json();
    //console.log("resData:", resData)
    let userUploads = resData.userUploads;
    //console.log("userUploads:", userUploads);

    return { userUploads };
}

export async function loader({ request, params }){
    const id = params.user_id;
    //console.log("loader id", id);

    return defer({
        data: await loadUserUploads(id),    
    })
}

export async function action({ request }) {
    // const method = request.method;
    const formData = await request.formData()
    const activity_id = formData.get("activity_id");
    const user_id = formData.get("user_id");
    const token = getAuthToken();

    const bodyComponent = {
        user_id, activity_id
    }

    
    const response = await fetch(`${API_URL}/activities/${activity_id}`, {
        method: request.method,
        headers: {
            'Content-Type' : 'application/json',
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(bodyComponent)
    });

    if (response.status === 422) throw new Response("", { status: 422 });
    if (response.status === 401) throw new Response("", { status: 401 });

    if(!response.ok) {
        throw json({message: "Could not delete activity."}, { status: 500})
    }

    return redirect(`/mypage/${user_id}/uploads`);
}

