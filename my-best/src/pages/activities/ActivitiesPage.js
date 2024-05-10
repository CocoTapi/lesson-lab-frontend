import ActivityList from "../../components/activities/ActivityList";
import { API_URL } from "../../App";
import { json, defer, useLoaderData, Await } from "react-router-dom";
import { Suspense } from "react";
import { getAuthToken } from "../util/checkAuth";

function ActivitiesPage() {
    const { activities } = useLoaderData();
    return (
        <Suspense fallback={<p style={{ textAlign: 'center' }}>Loading...</p>}>
            <Await resolve={activities}>
                {(loadedActivities) => <ActivityList activities={loadedActivities} />}
            </Await>
        </Suspense>
    )
};

export default ActivitiesPage;

export async function loadActivities() {
    const token = getAuthToken();
    let tokenHeaders = null;
    if (token) {
        tokenHeaders = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
        }
    }

    const response = await fetch(`${API_URL}/activities`, tokenHeaders);

    if(!response.ok) {
        throw json({message: "Could not fetch activities."}, { status: 500})
    }

    const resData = await response.json();
    //console.log(resData.activities);
    return resData.activities;
}

export async function loader(){
    return defer({
        activities: await loadActivities()
    })
}