import demoData from '../../demoData.json';

export const PLAYLIST_KEY = 'guest_playlist';
export const FAVORITES_KEY = 'guest_favorites';

// Fetch all activities from demo file
export function fetchActivities() {
    const activities = demoData.activities;
    if(!activities) throw new Error('There is no list of activities.')
    return activities;
}

// Fetch activity by activity_id
export function fetchActivityById(id) {
    const activities = fetchActivities();
    const activity = activities.find(activity => 
        activity.activity_id === id
    );

    if (!activity) throw new Error(`No matched activity with activity_id: ${id}`);

    return activity;
}

// Find activities based on search term
export function findActivities(searchTerm) {
    const activities = fetchActivities();  
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
export function getGuestData(key) {
    return JSON.parse(localStorage.getItem(key) || '[]');
}

export function setGuestData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Guest favorites functions
export function addGuestFavorite(activity_id) {
    const favorites = getGuestData(FAVORITES_KEY);

    if (!favorites.includes(activity_id)) {
        favorites.push(activity_id);
        setGuestData(FAVORITES_KEY, favorites);
    }
}

export function removeGuestFavorite(activity_id) {
    const updatedFavorites = getGuestData(FAVORITES_KEY).filter(id => id !== activity_id);
    setGuestData(FAVORITES_KEY, updatedFavorites);
}

export function addFavoritesIntoResponseData(activities) {
    const favActivities = getGuestData(FAVORITES_KEY);

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

export function getUserFavoritesActivity() {
    const favorites = getGuestData(FAVORITES_KEY);
    const list = [];
    const activities = fetchActivities();

    for (const activity of activities) {
        if (favorites.includes(activity.activity_id)) {
            list.push(activity);
        }
    }

    return list;
}

// Guest playlist functions

// Fetch userPlaylist
export function fetchGuestPlaylist() {
    let playlists = getGuestData(PLAYLIST_KEY);
    const activities = fetchActivities();

    // Iterate through the playlists and map activity IDs to activity details
    const userPlaylists = playlists.map(playlist => {
        const playlistActivities = playlist.activity_list.map((activityId, index) => {
            
            // Find the activity corresponding to the activityId
            const activity = activities.find(item => item.activity_id === activityId);

            if (!activity) {
                throw new Error(`Activity with activity_id: ${activityId} not found`);
            }

            // Build the activity object with additional details
            return {
                image_num: activity.image_num,
                activity_id: activity.activity_id,
                position: index + 1, // Position in the playlist (1-based index)
                title: activity.title,
                summary: activity.summary,
                duration: activity.duration,
                instructions: activity.instructions || 'N/A',
                objectives: activity.objectives || 'N/A',
                materials: activity.materials || 'N/A',
                links: activity.links || null
            };
        });

        // Calculate the total duration for the playlist
        const totalDuration = playlistActivities.reduce(
            (sum, activity) => sum + activity.duration, 0
        );

        return {
            playlist_id: playlist.playlist_id,
            playlist_title: playlist.playlist_title,
            user_id: 'guest', 
            total_duration: totalDuration,
            activities: playlistActivities,
            activity_ids: playlist.activity_list
        };
    });

    return userPlaylists; 

}

// create new activity with an activity
export async function addPlaylistWithId(title, activityDuration, activity_id) {
    // create new playlist
    const newPlaylist = await saveNewGuestPlaylist(title);
    if(!newPlaylist) throw new Error('Could not create new Playlist.');

    newPlaylist.total_duration = activityDuration;
    newPlaylist.activity_list.push(activity_id);

    return newPlaylist
}

// Add a new Playlist (Only the title of playlist)
export async function saveNewGuestPlaylist(playlistTitle) {
    const playlists = getGuestData(PLAYLIST_KEY);
    const newPlaylist =  {
        playlist_id: playlists.length + 1,
        playlist_title: playlistTitle,
        total_duration: 0,
        activity_list: []
    }

    playlists.push(newPlaylist);
    setGuestData(PLAYLIST_KEY, playlists);
    
    // return new playlist 
    return newPlaylist;
}

export function removeGuestPlaylist(playlist_id) {
    const updatedPlaylists = getGuestData(PLAYLIST_KEY).filter(p => 
        p.playlist_id !== playlist_id
    );

    if (!updatedPlaylists) throw new Error('Could not remove playlist.')

    setGuestData(PLAYLIST_KEY, updatedPlaylists);
}

export function addActivitiesToPlaylist(playlist_id, newIds, duration) {
    const playlists = getGuestData(PLAYLIST_KEY);

    const updated = playlists.map(p => {
        if (p.playlist_id === playlist_id) {
            return {
                ...p,
                total_duration: duration,
                activity_list: [...p.activity_list, ...newIds],
            };
        }
        return p;
    });

    setGuestData(PLAYLIST_KEY, updated);
}

export function removeActivityFromPlaylist(playlist_id, activity_id, duration){
    const playlists = getGuestData(PLAYLIST_KEY);

    const updated = playlists.map(p => {
        if (p.playlist_id === playlist_id) {
            return {
                ...p,
                activity_list: p.activity_list.filter(id => id !== activity_id),
                total_duration: Math.max(0, p.total_duration - (duration || 0))
            };
        }
        return p;
    });

    setGuestData(PLAYLIST_KEY, updated);
}

export function reorderPlaylist(playlist_id, reorderedActivityIds) {
    const playlists = getGuestData(PLAYLIST_KEY);

    const updated = playlists.map(p => {
        if (p.playlist_id === playlist_id) {
            return {
                ...p,
                activity_list: reorderedActivityIds
            };
        }
        return p;
    });

    setGuestData(PLAYLIST_KEY, updated);
}