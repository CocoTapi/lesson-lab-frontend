// import { getAuthToken } from "../util/checkAuth";
// import { API_URL } from "../../App";
// import { json, defer, redirect } from "react-router-dom";
// import { swalAlert } from "../util/swalModal";

// export async function action({ request, params }){
//     const data = await request.formData();  
//     const redirectPath = data.get('prev_location') || '/activities';
//     const activity_id = parseInt(params.activityId);
//     let user_id = data.get('user_id');
//     if(user_id !== 'guest') user_id = parseInt(user_id);

//     let method = request.method;
//     const token = getAuthToken();

//     if(token && user_id !== 'guest') {
//         const bodyComponent = {
//             user_id,
//             user_name: data.get('user_name'),
//             image_num: parseInt(data.get('image_num')),
//             title: data.get('title').trim(),
//             duration: parseInt(data.get('duration')),
//             age_group: data.get('age_group'),
//             summary: data.get('summary').trim(),
//             objectives: data.get('objectives').trim(),
//             materials:  data.get('materials').trim(),
//             instructions: data.get('instructions').trim(),
//             links: data.get('links').trim() || "null",
//             tags: JSON.parse(data.get('chosenTags'))
//         };
    
    
//         let url = `${API_URL}/activities`;
    
//         if (method === 'PATCH') {
//             url = `${API_URL}/activities/${activity_id}`;
//         }
    
//         const response = await fetch(url, {
//             method: method,
//             headers: {
//                 'Content-Type' : 'application/json',
//                 'Authorization': `Bearer ${token}`
//             },
//             body: JSON.stringify(bodyComponent)
//         })
    
//         if (response.status === 422 || response.status === 401) {
//             return response;
//         };
    
//         if (!response.ok){
//             throw json({ message: 'Could not save activity.'}, { status: 500 });
//         }

//         return redirect(redirectPath);
//     }

//     if (user_id === 'guest') {

//         swalAlert(
//             "Membership Required",
//             "Please log in or sign up to add an activity.", 
//             "OK"
//         );

//         return redirect('/auth?mode=login');                
//     }
    
// }

// async function loadTags(){
//     const token = getAuthToken();
//     if(token) {
//         const response = await fetch(`${API_URL}/tags`);

//         if(!response.ok) {
//             throw json({message: "Could not fetch tags."}, { status: 500})
//         }
    
//         const resData = await response.json();
//         return resData.tags;
//     } else {
//        return null;
//     }
// }

// export function loader(){
//     return defer({
//         tags: loadTags()
//     })
// }


