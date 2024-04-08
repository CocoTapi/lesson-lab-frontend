import ActivityList from "../../components/activities/ActivityList";
import { API_URL } from "../../App";

function ActivitiesPage() {
    return <div><ActivityList /></div>
};

export default ActivitiesPage;

async function loadActivities() {
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