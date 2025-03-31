// import { useRouteLoaderData, Await, json, redirect } from "react-router-dom";
// import { Suspense } from "react";
// import ProfileForm from "../../components/user_page/ProfileForm";
// import { getAuthToken } from "../util/checkAuth";
// import { API_URL } from "../../App";

// function EditProfilePage(){
//     const { data } = useRouteLoaderData('user-detail');
//     const userProfile = data.userProfile;

//     return (
//         <Suspense fallback={<p style={{ textAlign: 'center' }}>Loading...</p>}>
//             <Await resolve={userProfile} >
//                 {(loadedData) => <ProfileForm method="PATCH" userProfile={loadedData} />}
//             </Await>
//         </Suspense>
//     )
// };

// export default EditProfilePage;

// export async function action({ request, params }){
//     const data = await request.formData();   
//     const method = request.method;
//     const token = getAuthToken();
//     const user_id = data.get('user_id');
//     const user_name = data.get('user_name').trim();
//     const first_name = data.get('first_name').trim();
//     const last_name = data.get('last_name').trim();
//     const email = data.get('email').trim();
//     let password = null;
//     let confirmPassword = null;

//     if (data.get('password')) {
//         password = data.get('password').trim();
//         confirmPassword = data.get('confirmPassword').trim();

//         if (password !== confirmPassword) {
//             return { 
//                 message: "Edit profile failed due to validation errors.",
//                 errors: {
//                     confirmPassword: 'The password confirmation does not match.'
//                 }
//             }
//         }
//     }

//     const profileData = {
//         user_id: user_id,
//         user_name: user_name,
//         first_name: first_name,
//         last_name: last_name,
//         email: email,
//         password
//     };

//     let url;

//     if (method === 'PATCH') {
//         const user_id = params.user_id;
//         url = `${API_URL}/user/` + user_id;
//     } else {
//         throw new Error('Could not edit. Change to PATCH request.')
//     }

//     const response = await fetch(url, {
//         method: method,
//         headers: {
//             'Content-Type' : 'application/json',
//             'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(profileData)
//     })

//     //this make you show which item is invalid.
//     if (response.status === 422 || response.status === 401) {
//         return response;
//     }

//     if (!response.ok){
//         throw json({ message: 'Could not save profile change.'}, { status: 500 });
//     }
    
//     const resData = await response.json();

//     const newToken = resData.token;

//     //delete current token from local storage
//     await removeToken();

//     //store new token in local storage
//     await setupToken(newToken);

//     return redirect(`/mypage/${user_id}`);
// }

// async function removeToken(){
//     localStorage.removeItem('token');
//     localStorage.removeItem('expiration');
// }

// async function setupToken(token){
//     localStorage.setItem('token', token);
//     const expiration = new Date();
//     expiration.setHours(expiration.getHours() + 1);
//     localStorage.setItem('expiration', expiration.toISOString());
// }