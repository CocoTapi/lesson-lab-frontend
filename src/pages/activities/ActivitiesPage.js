import ActivityList from "../../components/activities/ActivityList";
import { json, defer, useLoaderData, Await, useActionData } from "react-router-dom";
import { Suspense, useState, useEffect } from "react";
import { addFavoritesIntoResponseData, fetchActivities, findActivities } from "../util/saveGuestData";

function ActivitiesPage() {
    const { activities: initialActivities } = useLoaderData();
    const [activities, setActivities] = useState(initialActivities);
    const filteredActivities = useActionData();

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
    let activities;

    activities = await fetchActivities();

    if(!activities) throw json({ message: "Could not fetch activities." }, { status: 500 })
        await addFavoritesIntoResponseData(activities);
 
    
    return activities;
}

export async function loader() {
    return defer({
        activities: await loadActivities()
    })
}

// Handle search activities
export async function action({ request }) {
    const formData = await request.formData()
    const searchTerm = formData.get('searchTerm').trim();

    let filteredActivities;

   
    filteredActivities = await findActivities(searchTerm);

    if(!filteredActivities) throw json({ message: "Could not fetch filtered activities." }, { status: 500 })

    await addFavoritesIntoResponseData(filteredActivities);


    return filteredActivities;
}

