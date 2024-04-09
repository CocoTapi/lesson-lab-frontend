import { API_URL } from "../../App";
import { json, defer, useLoaderData, Await } from "react-router-dom";
import { Suspense } from "react";
import ActivityItem from "../../components/activities/ActivityItem";
import ActivityList from "../../components/activities/ActivityList";
import { loadActivities } from "./ActivitiesPage";


function ActivityDetailPage(){
    const { activity, activities } = useLoaderData('activity-detail');
    return (
        <>
            <Suspense fallback={<p style={{ textAlign: 'center' }}>Loading...</p>}>
                <Await resolve={activity}>
                    {(loadedActivity) => <ActivityItem activity={loadedActivity} />}
                </Await>
            </Suspense>
            <Suspense fallback={<p style={{ textAlign: 'center' }}>Loading...</p>}>
                <Await resolve={activities}>
                    {(loadedActivities) => <ActivityList activities={loadedActivities} />}
                </Await>
            </Suspense>
        </>
    )
};

export default ActivityDetailPage;

async function loadActivity(id) {
    const response = await fetch(`${API_URL}/activities/` + id);

    if(!response.ok) {
        throw json({message: "Could not fetch activity detail."}, { status: 500})
    }

    const resData = await response.json();
    return resData.activity;
}


export function loader(){
    return defer({
        activity: loadActivity(),
        activities: loadActivities()
    })
}