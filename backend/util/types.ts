export interface SignUpInfo extends LoginInfo {
    first_name: string,
    last_name: string,
}

export interface LoginInfo {
    email: string,
    password: string
}

export interface UserInfo {
    user_id: number,
    first_name: string,
    last_name: string,
    email: string,
    created_date: Date,
    last_update: Date,
    last_login: Date
}

export interface AuthRequest extends Request {
    email?: string;
}

export interface ErrorMessage {
    [key: string]: string;
};

export interface AuthValidationErrorBoolean {
    length?: boolean,
    simbol?: boolean,
    num?: boolean
}

export interface ActivityFormInfo {
    user_id: number,
    title: string,
    summary: string,
    duration: number,
    age_group: string,
    objectives: string,
    materials: string,
    instructions: string,
    links: string,
    tags: string[],
    [key: string]: string | number | string[] | boolean | undefined,
    is_favorited?: boolean
    likes_count?: number
}

export interface ProfileInfo {
    user_id: number,
    user_name: string,
    first_name: string,
    last_name: string,
    email: string,
    password: string
}

export interface FavoritesInfo {
    [key: string]: number
}

export interface UserPlaylist {
    user_name: string;
    playlist_title: string;
    activity_ids: number[];
    activity_titles: string[];
    summaries: string[];
    durations: number[];
    total_duration: string;
}

export interface UserPlaylistsContainer {
    userPlaylists: UserPlaylist[];
}




