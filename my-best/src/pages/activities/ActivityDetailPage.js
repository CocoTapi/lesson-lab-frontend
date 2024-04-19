import { API_URL } from "../../App";
import { json, defer, Await, redirect, useRouteLoaderData } from "react-router-dom";
import { Suspense } from "react";
import ActivityItem from "../../components/activities/ActivityItem";
//import ActivityList from "../../components/activities/ActivityList";
import { loadActivities } from "./ActivitiesPage";
import { getAuthToken } from "../util/checkAuth";


function ActivityDetailPage(){
    const { activity } = useRouteLoaderData('activity-detail');
    return (
        <>
            <Suspense fallback={<p style={{ textAlign: 'center' }}>Loading...</p>}>
                <Await resolve={activity}>
                    {(loadedActivity) => <ActivityItem activity={loadedActivity} />}
                </Await>
            </Suspense>
            {/* <Suspense fallback={<p style={{ textAlign: 'center' }}>Loading...</p>}>
                <Await resolve={activities}>
                    {(loadedActivities) => <ActivityList activities={loadedActivities} />}
                </Await>
            </Suspense> */}
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
    return resData.activity[0];
}

export async function loader({ request, params }){
    const id = params.activityId;

    return defer({
        activity: await loadActivity(id),
        activities: loadActivities()
    })
}

export async function action({ params, request }) {
    const activityId = params.activityId;

    const token = getAuthToken();
    const response = await fetch(`${API_URL}/activities/` + activityId, {
        method: request.method,
        headers: {
            "Authorization": 'Bearer' + token
        }
    });

    if(!response.ok) {
        throw json({message: "Could not delete activity."}, { status: 500})
    }

    return redirect('/activities');
}