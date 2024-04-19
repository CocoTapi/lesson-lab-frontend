import { useRouteLoaderData, Await, json, redirect } from "react-router-dom";
import { Suspense } from "react";
import ProfileForm from "../../components/user_page/ProfileForm";
import { getAuthToken } from "../util/checkAuth";
import { API_URL } from "../../App";

function EditProfilePage(){
    const { userDetail } = useRouteLoaderData('user-detail');

    return (
        <Suspense fallback={<p style={{ textAlign: 'center' }}>Loading...</p>}>
            <Await resolve={userDetail} >
                {(loadedData) => <ProfileForm method="PATCH" userDetail={loadedData} />}
            </Await>
        </Suspense>
    )
};

export default EditProfilePage;

export async function action({ request, params }){
    const data = await request.formData();   
    const method = request.method;
    const token = getAuthToken();
    const user_id = data.get('user_id');
    const user_name = data.get('user_name').trim();
    const firstName = data.get('firstName').trim();
    const lastName = data.get('lastName').trim();
    const email = data.get('email').trim();
    const password = data.get('password').trim();

    const profileData = {
        user_id: user_id,
        user_name: user_name,
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
    };

    console.log("profile data: ", profileData);

    let url = `${API_URL}/user`;

    if (method === 'PATCH') {
        const user_id = params.user_id;
        url = `${API_URL}/user` + user_id;
    } else {
        throw Error('Could not edit. Change to PATCH request.')
    }

    const response = await fetch(url, {
        method: method,
        headers: {
            'Content-type' : 'application/json',
            'Authorization': 'Bearer' + token,
        },
        body: JSON.stringify(profileData)
    })
    
    console.log("response data: ", response)

    if (response.status === 422 || response.status === 401) {
        return response;
    };

    if (!response.ok){
        throw json({ message: 'Could not save profile change.'}, { status: 500 });
    }


    return redirect('/user');
}