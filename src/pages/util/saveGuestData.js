export const PLAYLIST_KEY = 'guest_playlist';
export const FAVORITES_KEY = 'guest_favorites';

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
        activity.is_favorited = favActivities.includes(activity.activity_id);
        if (activity.is_favorited) activity.like_count++;
    }
}

// Guest playlist functions
export function saveNewGuestPlaylist(playlistTitle) {
    const playlists = getGuestData(PLAYLIST_KEY);
    const newPlaylist =  {
        playlist_id: playlists.length + 1,
        playlist_title: playlistTitle,
        total_duration: 0,
        activity_list: []
    }
    playlists.push(newPlaylist);
    setGuestData(PLAYLIST_KEY, playlists);
}

export function removeGuestPlaylist(playlist_id) {
    const updatedPlaylists = getGuestData(PLAYLIST_KEY).filter(p => 
        p.playlist_id !== playlist_id
    );

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