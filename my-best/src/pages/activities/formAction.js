import { getAuthToken } from "../util/checkAuth";
import { API_URL } from "../../App";
import { json, defer, redirect } from "react-router-dom";

export async function action({ request, params }){
    const data = await request.formData();   
    const method = request.method;
    const token = getAuthToken();

    // TODO: get user id

    const activityData = {
        user_id: parseInt(data.get('user_id')),
        title: data.get('title').trim(),
        duration: parseInt(data.get('duration')),
        age_group: data.get('age_group'),
        summary: data.get('summary').trim(),
        objectives: data.get('objectives').trim(),
        materials:  data.get('materials').trim(),
        instructions: data.get('instructions').trim(),
        links: data.get('links').trim() || "null",
        tags: JSON.parse(data.get('chosenTags'))
    };

    console.log("activity data: ", activityData);

    let url = `${API_URL}/activities`;

    if (method === 'PATCH') {
        const activityId = params.activityId;
        url = `${API_URL}/activities` + activityId;
    }

    const response = await fetch(url, {
        method: method,
        headers: {
            'Content-Type' : 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(activityData)
    })
    
    console.log("response data: ", response)

    if (response.status === 422 || response.status === 401) {
        return response;
    };

    if (!response.ok){
        throw json({ message: 'Could not save activity.'}, { status: 500 });
    }


    return redirect('/activities');
}

async function loadTags(){
    const response = await fetch(`${API_URL}/tags`);

    if(!response.ok) {
        throw json({message: "Could not fetch tags."}, { status: 500})
    }

    const resData = await response.json();
    return resData.tags;
}

export function loader(){
    return defer({
        tags: loadTags()
    })
}
