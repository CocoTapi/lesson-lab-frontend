export function saveGuestData(section, data) {
    const key = 'guest_user_data';
    const existing = JSON.parse(localStorage.getItem(key) || '{}');

    if (!existing[section]) {
        existing[section] = [];
    }

    existing[section].push(data);
    localStorage.setItem(key, JSON.stringify(existing));
}

// handle guest favorites in local storage
const FAVORITES_KEY = 'guest_favorites';

export function getGuestFavorites() {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
}

export function addGuestFavorite(activity_id) {
    const favorites = getGuestFavorites();

    if (!favorites.includes(activity_id)) {
        favorites.push(activity_id);
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
}

export function removeGuestFavorite(activity_id) {
    const favorites = getGuestFavorites().filter(
        id => id !== activity_id
    );

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

export function addFavoritesIntoResponseData(activities){
    const favActivities = getGuestFavorites();

    // add is_favorited into each activity
    for (const activity of activities) {
        activity.is_favorited = favActivities.includes(activity.activity_id) 
    }
}