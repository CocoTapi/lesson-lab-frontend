import { getAuthToken } from "../util/checkAuth";
import { API_URL } from "../../App";
import { json, defer, redirect } from "react-router-dom";

export async function action({ request, params }){
    const data = await request.formData();   
    const method = request.method;
    const token = getAuthToken();

    const activityData = {
        title: data.get('title'),
        duration: data.get('title'),
        ageGroup: data.get('ageGroup'),
        summary: data.get('summary'),
        objectives: data.get('objectives'),
        materials:  data.get('materials'),
        instructions: data.get('instructions'),
        links: data.get('links'),
        tags: data.get('chosenTags')
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
            'Content-type' : 'application/json',
            'Authorization': 'Bearer' + token,
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
        tags: ["icebreaker", "fun", "interactive", "group work"]
    })
}
