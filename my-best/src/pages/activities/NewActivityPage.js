import Card from "../../components/UI/Card";
import NewActivityForm from "../../components/activities/NewActivityForm";
import { API_URL } from "../../App";
import { defer, json, useLoaderData, Await } from "react-router-dom";
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
    const title = data.get('title');
    const duration = data.get('duration');
    const ageGroup = data.get('ageGroup');
    const objectives = data.get('objectives');
    const materials = data.get('materials');
    const instruction = data.get('instruction');
    const tags = data.get('chosenTags')
   

    console.log(data);
    console.log("title:", title);
    console.log("duration:", duration);
    console.log("ageGroup:", ageGroup);
    console.log("objectives:", objectives);
    console.log("materials:", materials);
    console.log("instruction:", instruction);
    console.log("tags: ", tags);
    
}