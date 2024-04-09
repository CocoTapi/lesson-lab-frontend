import ActivityList from "../../components/activities/ActivityList";
import { API_URL } from "../../App";
import { json, defer, useLoaderData, Await } from "react-router-dom";
import { Suspense } from "react";

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
    const response = await fetch(`${API_URL}/activities`);

    if(!response.ok) {
        throw json({message: "Could not fetch activities."}, { status: 500})
    }

    const resData = await response.json();
    return resData.activities;
}

export function loader(){
    return defer({
        activities: loadActivities()
    })
}