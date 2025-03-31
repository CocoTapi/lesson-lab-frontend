import { json, defer, Await, useRouteLoaderData, redirect } from "react-router-dom";
import { Suspense } from "react";
import ActivityItem from "../../components/activities/ActivityItem";
import { loadActivities } from "./ActivitiesPage";
import { addActivitiesToPlaylist, addGuestFavorite, addPlaylistWithId, FAVORITES_KEY, fetchActivityById, getGuestData, removeGuestFavorite } from "../util/saveGuestData";
import { swalError, swalSuccess } from "../util/swalModal";

// TODO: tell user for the successful playlist update

function ActivityDetailPage() {
    const { activity, activities } = useRouteLoaderData('activity-detail');
    
    return (
        <>
            <Suspense fallback={<p style={{ textAlign: 'center' }}>Loading...</p>}>
                <Await resolve={{activity, activities}}>
                    {({activity: loadedActivity, activities: loadedActivities}) => 
                        <ActivityItem activity={loadedActivity} activities={loadedActivities} />}
                </Await>
            </Suspense>
        </>
    )
};

export default ActivityDetailPage;

async function loadActivity(id) {
 
    const activity_id = parseInt(id);
    const activity = await fetchActivityById(activity_id);

    if(!activity) throw json({ message: "Could not fetch activity detail." }, { status: 500 })

    // Update guest is_favorited
    const favActivities = await getGuestData(FAVORITES_KEY);

    if (!favActivities) throw json({ message: "Could not get favorite activities." }, { status: 500 })
    
    activity.is_favorited = favActivities.includes(activity.activity_id);
  

    return activity;
}

export async function loader({ request, params }) {
    const id = params.activityId;

    return defer({
        activity: await loadActivity(id),
        activities: await loadActivities()
    })
}

// handle user's like or dislike an activity, add an activity to playlist.
export async function action({ params, request }) {
    const activity_id = parseInt(params.activityId);
    const method = request.method;
    if(!method) throw new Error({ message: "Method is missing." }) ;

    // const token = getAuthToken();
    const formData = await request.formData();
    const user_id = formData.get("user_id");
    if (user_id !== 'guest') parseInt(user_id);
    
    const playlist_title = formData.get("playlist_title");

    
    // manage user likes
    if (method === "POST" && !playlist_title) {

        const isFavorite = formData.get("is_favorited") === "true"

        if (isFavorite) {
            const isRemoved = await removeGuestFavorite(activity_id);

            if(!isRemoved) swalError();
        } else {
            const isAdded = await addGuestFavorite(activity_id);

            if(!isAdded) swalError();
        }
    }

    // Add an activity into already existed playlist
    if (method === "PATCH") {
        const playlist_id = parseInt(formData.get("playlist_id"));
        const arr = [];
        arr.push(activity_id);

        const durations = parseInt(formData.get('activityDuration'));
        const isUpdated = await addActivitiesToPlaylist(playlist_id, arr, durations);

        if(!isUpdated) throw json({ message: "Activity request failed." }, { status: 500 })

    } 

    // Create a new playlist with the activity
    if (method === 'POST' && playlist_title) {
        const activity_duration = formData.get('activity_duration');
        const newPlaylist = await addPlaylistWithId(playlist_title, activity_duration, activity_id);

        if(newPlaylist) {
            swalSuccess();
        } else {
            swalError();
        }
    
    }

    return redirect(`/activities/${activity_id}`);
}