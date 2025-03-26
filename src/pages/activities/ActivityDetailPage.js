import { API_URL } from "../../App";
import { json, defer, Await, useRouteLoaderData, redirect } from "react-router-dom";
import { Suspense } from "react";
import ActivityItem from "../../components/activities/ActivityItem";
// import ActivityList from "../../components/activities/ActivityList";
import { loadActivities } from "./ActivitiesPage";
import { getAuthToken } from "../util/checkAuth";
import { addGuestFavorite, getGuestFavorites, removeGuestFavorite, saveGuestData } from "../util/saveGuestData";



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


    const response = await fetch(`${API_URL}/activities/${id}`, tokenHeaders);

    if (!response.ok) {
        throw json({ message: "Could not fetch activity detail." }, { status: 500 })
    }

    const resData = await response.json();

    const activity = resData.activity[0];

    if(!token) {
        const favActivities = getGuestFavorites();
       
        activity.is_favorited = favActivities.includes(activity.activity_id);
    }

    return activity;
}

export async function loader({ request, params }) {
    const id = params.activityId;

    return defer({
        activity: await loadActivity(id),
        activities: await loadActivities()
    })
}

export async function action({ params, request }) {
    const activity_id = parseInt(params.activityId);
    const method = request.method;
    if(!method) throw json({ message: "Method is missing." }) ;

    const token = getAuthToken();
    const formData = await request.formData();
    const user_id = formData.get("user_id");
    if (user_id !== 'guest') parseInt(user_id);

    let response;

    if (method === "DELETE") {
        if(token && user_id !== 'guest') {
            response = await fetch(`${API_URL}/activities/${activity_id}`, {
                method: method,
                headers: {
                    "Authorization": 'Bearer' + token
                }
            });
        } else {
            removeGuestFavorite(activity_id);
        }
    }
    
    // manage user likes
    if (method === "POST") {
        const favData = {
            user_id,
            activity_id,
            is_favorited: formData.get("is_favorited") === "true"
        }

        if(token && user_id !== 'guest') {
            response = await fetch(`${API_URL}/user/${user_id}/favorites`, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(favData)
            });
        } else if (user_id === 'guest') {
            if (favData.is_favorited) {
                removeGuestFavorite(activity_id);
            } else {
                addGuestFavorite(activity_id);
            }
        }
    }

    if (method === "PATCH") {
        const playlist_id = parseInt(formData.get("playlist_id"));
        const arr = [];
        arr.push(activity_id);

        let playlistData = {
            user_id,
            playlist_id,
            activity_id_arr: arr
        };

        if (token && user_id !== 'guest') {
        response = await fetch(`${API_URL}/user/${user_id}/playlists/${playlist_id}`, {
            method: method,
            headers: {
                'Content-Type' : 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(playlistData)
        })
        } else if (user_id === 'guest'){
            playlistData = {
                playlist_id,
                activity_id_arr: arr
            };
            
            saveGuestData('playlists', playlistData);
        }

    } 

    if (response?.status === 422 || response?.status === 401) {
        return response;
    };

    if (response && !response.ok) {
        throw json({ message: "Activity request failed." }, { status: 500 })
    }

    return redirect(`/activities/${activity_id}`);
}