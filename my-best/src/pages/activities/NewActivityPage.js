import Card from "../../components/UI/Card";
import NewActivityForm from "../../components/activities/NewActivityForm";
import { API_URL } from "../../App";
import { defer, json, useLoaderData, Await, redirect } from "react-router-dom";
import { Suspense } from "react";

function NewActivityPage(){
    const { tags } = useLoaderData();
    return (
        <Card>
            <Suspense fallback={<p style={{ textAlign: 'center' }}>Loading...</p>}>
                <Await resolve={tags} >
                    {(loadedTags) => <NewActivityForm existingTags={loadedTags} />}
                </Await>
            </Suspense>
        </Card>
    )
}

export default NewActivityPage;

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

export async function action({ request }){
    const data = await request.formData();   

    const newActivityData = {
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

    console.log("new activity data: ", newActivityData);

    const response = await fetch(`${API_URL}/new-activity`, {
        method: "POST",
        headers: {
            'Content-type' : 'application/json'
        },
        body: JSON.stringify(newActivityData)
    })
    
    console.log("response data: ", response);

    //error handling
    if (response.status === 422 || response.status === 401) {
        return response;
    };

    if (!response.ok){
        throw json({ message: 'Could not add activity.'}, { status: 500 });
    }


    return redirect('/activities');
}