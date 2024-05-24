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

export interface EditProfileInfo {
    user_id: number,
    user_name: string,
    first_name: string,
    last_name: string,
    email: string,
    password: string | null
}

export interface FavoritesInfo {
    [key: string]: number
}

export interface PlaylistActivity {
    activity_ids: number,
    position: number,
    titles: string,
    summary: string,
    duration: number,
    instructions: string,
    objectives: string,
    materials: string,
    links: string | null
}

export interface UserPlaylistResult extends PlaylistActivity {
    playlist_id: number,
    playlist_title: string,
    user_id: number,
}

export interface FormattedPlaylist {
    playlist_id: number,
    playlist_title: string,
    user_id: number,
    total_duration: number,
    activities: PlaylistActivity[]
} 





