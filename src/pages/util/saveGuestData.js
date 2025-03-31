import demoData from '../../demoData.json';

export const PLAYLIST_KEY = 'guest_playlist';
export const FAVORITES_KEY = 'guest_favorites';

// Fetch all activities from demo file
export async function fetchActivities() {
    const activities = demoData.activities;
    if(!activities) {
        return null;
        // throw new Error('There is no list of activities.')
    }
    return activities;
}

// Fetch activity by activity_id
export async function fetchActivityById(id) {
    const activities = await fetchActivities();
    const activity = activities.find(activity => 
        activity.activity_id === id
    );

    if (!activity) {
        return null;

        // react router dom doesn't handle this
        // throw new Error(`No matched activity with activity_id: ${id}`);
    }

    return activity;
}

// Find activities based on search term
export async function findActivities(searchTerm) {
    const activities = await fetchActivities();  
    const lowercasedSearchTerm = searchTerm.toLowerCase(); 

    const matchedActivities = activities.filter(activity => {
        // Check if any of the fields contain the search term (case-insensitive)
        return (
            activity.title.toLowerCase().includes(lowercasedSearchTerm) ||
            activity.summary.toLowerCase().includes(lowercasedSearchTerm) ||
            activity.duration.toString().includes(lowercasedSearchTerm) ||
            activity.age_group.toLowerCase().includes(lowercasedSearchTerm) ||
            activity.tags.some(tag => tag.toLowerCase().includes(lowercasedSearchTerm))
        );
    });

    if(!matchedActivities) return [];

    return matchedActivities; 
}

// General utilities
export async function getGuestData(key) {
    return JSON.parse(localStorage.getItem(key) || '[]');
}

export async function setGuestData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Guest favorites functions
export async function addGuestFavorite(activity_id) {
    const favorites = await getGuestData(FAVORITES_KEY);

    if (!favorites.includes(activity_id)) {
        favorites.push(activity_id);
        setGuestData(FAVORITES_KEY, favorites);
    }
}

export async function removeGuestFavorite(activity_id) {
    const userFavorites = await getGuestData(FAVORITES_KEY);
    if(!userFavorites) {
        return null;
        // throw new Error('Could not get guests favorite data.')
    }
    
    const updatedFavorites = userFavorites.filter(id => id !== activity_id);
    setGuestData(FAVORITES_KEY, updatedFavorites);
}

export async function addFavoritesIntoResponseData(activities) {
    const favActivities = await getGuestData(FAVORITES_KEY);

    for (const activity of activities) {
        // Store original like count if not already stored
        if (activity.original_like_count === undefined) {
            activity.original_like_count = activity.like_count;
        }

        // Check if the activity is favorited (return boolean)
        activity.is_favorited = favActivities.includes(activity.activity_id);

        // If favorited, add 1 to the like count, otherwise reset to original
        if (activity.is_favorited) {
            activity.like_count = activity.original_like_count + 1;
        } else {
            activity.like_count = activity.original_like_count;
        }
    }
}

export async function getUserFavoritesActivity() {
    const favorites = await getGuestData(FAVORITES_KEY);
    const list = [];
    const activities = await fetchActivities();

    for (const activity of activities) {
        if (favorites.includes(activity.activity_id)) {
            list.push(activity);
        }
    }

    return list;
}

// Guest playlist functions

// Fetch userPlaylist
export async function fetchGuestPlaylist() {
    const [playlists, allActivities] = await Promise.all([
        getGuestData(PLAYLIST_KEY),  //array
        fetchActivities() //object
    ]);

    // make a map to insert activity by id
    const activityMap = new Map(allActivities.map(activity => [activity.activity_id, activity]));

    const userPlaylists = playlists.map(playlist => {
        const activities = [];
        playlist.activity_ids.map((activity_id, index) => {
            const activity = activityMap.get(activity_id);

            if (!activity) {
                return null
                // throw new Error(`Activity with activity_id: ${activity_id} not found`);
               
            }

            // Add position to the activity object
            const activityWithPosition = {
                ...activity,
                position: index + 1
            };

            activities.push(activityWithPosition);
        });

        // Add activities to the playlist
        return {
            ...playlist,
            activities: activities
        };
    })
    
    return userPlaylists; 

}

// create new activity with an activity
export async function addPlaylistWithId(title, activityDuration, activity_id) {
    // create new playlist
    const newPlaylist = await saveNewGuestPlaylist(title);
    if(!newPlaylist){
        return null;
        // throw new Error('Could not create new Playlist.');
    }

    newPlaylist.total_duration = activityDuration;
    newPlaylist.activity_ids.push(activity_id);

    // Update userPlaylists
    await updatePlaylist(newPlaylist);

    return newPlaylist
}

async function updatePlaylist(updatedPlaylist){
    const playlists = await getGuestData(PLAYLIST_KEY);

    // Find the index of the playlist to replace
    const index = playlists.findIndex(
        (playlist) => playlist.playlist_id === updatedPlaylist.playlist_id
    );

    if (index !== -1) {
        // ✅ Replace the existing playlist with the updated one
        playlists[index] = updatedPlaylist;

        // Save the entire playlists
        setGuestData(PLAYLIST_KEY, playlists);
    } else {
        return null;
        // throw new Error(`Playlist with ID ${updatedPlaylist.playlist_id} not found.`);
    }
}

// Add a new Playlist (Only the title of playlist)
export async function saveNewGuestPlaylist(playlistTitle) {
    const playlists = await getGuestData(PLAYLIST_KEY);
    
    const newPlaylist =  {
        playlist_id: playlists.length + 1,
        playlist_title: playlistTitle,
        total_duration: 0,
        activity_ids: []
    }

    playlists.push(newPlaylist);
    setGuestData(PLAYLIST_KEY, playlists);
    
    // return new playlist 
    return newPlaylist;
}

// Remove Guest Playlist
export async function removeGuestPlaylist(playlist_id) {
    const data =  await getGuestData(PLAYLIST_KEY);

    const updatedPlaylists = data.filter(p => 
        p.playlist_id !== playlist_id
    );

    if (!updatedPlaylists) {
        return null;
        // throw new Error('Could not remove playlist.')
    }

    setGuestData(PLAYLIST_KEY, updatedPlaylists);

    // TODO: check if it is correctly updated and return new playlist 
}

export async function addActivitiesToPlaylist(playListId, newIds, duration) {
    const playlists = await getGuestData(PLAYLIST_KEY);
    let correctDuration;

    const updated = playlists.map(p => {
        if (p.playlist_id === playListId) {
            correctDuration = parseInt(p.total_duration) + parseInt(duration);
            return {
                ...p,
                total_duration: correctDuration,
                activity_ids: [...p.activity_ids, ...newIds],
            };
        }
        return p;
    });

    setGuestData(PLAYLIST_KEY, updated);

    const updatedPlaylists = await getGuestData(PLAYLIST_KEY);
    const updatedPlaylist = updatedPlaylists.find(p => p.playlist_id === playListId);
    const updatedDuration = parseInt(updatedPlaylist.total_duration);

    // return true(success) or false
    return correctDuration === updatedDuration

}

export async function removeActivityFromPlaylist(playlist_id, activity_id, duration){
    const playlists = await getGuestData(PLAYLIST_KEY);

    const updated = playlists.map(p => {
        if (p.playlist_id === playlist_id) {
            return {
                ...p,
                activity_ids: p.activity_ids.filter(id => id !== activity_id),
                total_duration: Math.max(0, p.total_duration - (duration || 0))
            };
        }
        return p;
    });

    setGuestData(PLAYLIST_KEY, updated);
}

export async function reorderPlaylist(playlist_id, reorderedActivityIds) {
    const playlists = await getGuestData(PLAYLIST_KEY);

    const updated = playlists.map(p => {
        if (p.playlist_id === playlist_id) {
            return {
                ...p,
                activity_ids: reorderedActivityIds
            };
        }
        return p;
    });

    setGuestData(PLAYLIST_KEY, updated);
}