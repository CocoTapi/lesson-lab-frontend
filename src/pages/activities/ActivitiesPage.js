import ActivityList from "../../components/activities/ActivityList";
import { API_URL } from "../../App";
import { json, defer, useLoaderData, Await, useActionData } from "react-router-dom";
import { Suspense, useState, useEffect } from "react";
import { getAuthToken } from "../util/checkAuth";

function ActivitiesPage() {
    const { activities: initialActivities } = useLoaderData();
    const [activities, setActivities] = useState(initialActivities);
    const filteredActivities = useActionData();

    //console.log("activities:", activities)

    //TODO: handle if there is 0 match 

    useEffect(() => {
        if (filteredActivities) {
            setActivities(filteredActivities);
        } else {
            setActivities(initialActivities)
        }
    }, [filteredActivities]);

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

    if (!response.ok) {
        throw json({ message: "Could not fetch activities." }, { status: 500 })
    }

    const resData = await response.json();
    return resData.activities;
}

export async function loader() {
    return defer({
        activities: await loadActivities()
    })
}

export async function action({ request }) {
    const formData = await request.formData()
    const searchTerm = formData.get('searchTerm').trim();
    const token = getAuthToken();
    let tokenHeaders = null;

    const searchTermObj = {
        searchTerm
    }


    if (token) {
        tokenHeaders = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(searchTermObj)
        }
    } else {
        tokenHeaders = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(searchTermObj)
        }
    }

    const response = await fetch(`${API_URL}/activities/search`, tokenHeaders);

    if (!response.ok) {
        throw json({ message: "Could not fetch filtered activities." }, { status: 500 })
    }

    const resData = await response.json();
    //console.log("filteredActivities: ", resData.activities);

    const filteredActivities = resData.activities;

    return filteredActivities;
}