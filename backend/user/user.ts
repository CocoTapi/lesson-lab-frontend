import Database from "../database/Database";
import bcrypt from "bcrypt";
import { EditProfileInfo, ErrorMessage, FavoritesInfo, FormattedPlaylist, UserPlaylistResult } from "../util/types";
import env from 'dotenv';
import { isValidText, isValidEmail, isValidPassword } from "../util/validation";
import {
    getUserFavoritesQuery,
    getUserUploadsQuery,
    userProfileQuery,
    countSameTextQuery,
    updateProfileQuery,
    getUserPlaylistsQuery,
    addPlaylistQuery,
    deleteActivitiesQuery,
    deletePlaylistQuery,
    removeActivityFromPlaylistQuery,
    reformatPlaylistData,
    getActivityInsertionQuery,
    getCurrentActivityCount
} from "./util";

env.config();
const db = Database.db;
const saltRounds = parseInt(process.env.SALTROUNDS as string);

export async function getUserDataFromEmail(email: string) {
    console.log("email:", email)
    const minimumUserData = `
        SELECT 
            u.user_id,
            u.user_name
        FROM 
            users AS u
        WHERE 
            email = $1
        GROUP BY 
            u.user_name,  u.user_id
    `;
    const result = await db.query(minimumUserData, [email]);

    if (!(result.rows.length > 0)) throw Error("User doesn't exist.");

    const userInfo = result.rows[0];
    console.log("data:", userInfo);
    return userInfo;
}

export async function getUserProfile(email: string) {
    const result = await db.query(userProfileQuery, [email]);
    //console.log("email:", email);
    //console.log("result:", result);

    if (!(result.rows.length > 0)) throw Error("Could not get user profile.");

    const userProfile = result.rows[0];

    delete userProfile.password;

    return userProfile;
}

export async function getUserFavorites(user_id: number) {
    const userFavoritesQuery = getUserFavoritesQuery();

    const result = await db.query(userFavoritesQuery, [user_id]);

    let userFavorites = {};

    //when user does not have any favorite activities
    if (result.rows.length === 0) return userFavorites;

    userFavorites = result.rows;

    return userFavorites;
}

export async function getUserUploads(user_id: number) {
    const userUploadsQuery = getUserUploadsQuery();

    const result = await db.query(userUploadsQuery, [user_id]);

    let userUploads = {};

    //when user does not have any uploads
    if (result.rows.length === 0) return userUploads;
    
    userUploads = result.rows;
    return userUploads;
}

export async function getUserPlaylists(user_id: number) {
    const userPlaylistsQuery: string = getUserPlaylistsQuery();

    const result = await db.query(userPlaylistsQuery, [user_id]);

    // When user does not have any playlists
    if (result.rows.length === 0) return [];

    const userPlaylists: UserPlaylistResult[] = result.rows as UserPlaylistResult[];

    const formattedPlaylist: FormattedPlaylist[] = await reformatPlaylistData(userPlaylists);

    return formattedPlaylist;

    //when user does not have any playlists
    //if (result.rows.length === 0) return userPlaylistsResult;
    
    
    // userPlaylistsResult = result.rows;
    // console.log(userPlaylistsResult);

    // const userPlaylists: UserPlaylistResult[] = Object.values(userPlaylistsResult) as UserPlaylistResult[];
    
    // const formattedPlaylist: FormattedPlaylist[] = await reformatPlaylistData(userPlaylists);

    //const userPlaylists: UserPlaylist[] = Object.values(userPlaylistsResult) as UserPlaylist[];

    //const formattedActivityData = await reformatActivityData(userPlaylists);

    //return formattedPlaylist;
}

//error handling
export async function checkEditProfileValidation({ user_id, user_name, email, password, first_name, last_name }: EditProfileInfo) {
    const errors : ErrorMessage = {};
    let passwordValidity;

    const emailValidity = isValidEmail(email);
    const first_nameValidity = isValidText(first_name);
    const last_nameValidity = isValidText(last_name);
    const textValidity = isValidText(user_name, 2);

    if (password !== null) {
        passwordValidity = isValidPassword(password, 8);

        if (passwordValidity.length === false) errors.length = "Invalid password length. Must be at least 8 characters long.";
        if (passwordValidity.simbol === false) errors.simbol = "Invalid password. Must be at least one simbol in your password.";
        if (passwordValidity.num === false) errors.num = "Invalid password. Must be at least one number in your password."
    }
 
    if (!emailValidity) errors.email = "Invalid email.";
    if(!first_nameValidity) errors.first_name = "Invalid first name.";
    if(!last_nameValidity) errors.last_name = "Invalid last name.";
    if (!textValidity) errors.user_name = "Invalid user name.";

    const sameCount: number = await isTextUnique(user_name, user_id);
    console.log("same count", sameCount);

    if (sameCount > 0) {
        errors.user_name = "This user name is already used. Try different name.";
        return errors
    }
  
    if (Object.keys(errors).length > 0) return errors;
  
    console.log("Passed all validations!");
    return {};
  }


async function isTextUnique(user_name: string, user_id: number) {
    const result = await db.query(countSameTextQuery, [user_name, user_id]);
    if (!(result.rows.length > 0)) throw Error("Could not fetch the number of same text columns.");

    const sameCount: number = result.rows[0].count;
    console.log(sameCount);

    return sameCount;
}


export async function editProfile(prevEmail: string, updateData: EditProfileInfo) {
    const date = new Date();
    let hashResult;
    let parameters = [
        updateData.user_name,
        updateData.first_name,
        updateData.last_name,
        updateData.email,
        date,
        prevEmail
    ];


    if (updateData.password !== null) {
        hashResult = bcrypt.hashSync(updateData.password, saltRounds);

        if (!hashResult) throw new Error('Password hash fail. User not created')

        parameters.push(hashResult);
    }

    const query = updateProfileQuery(updateData.password);
    

    await db.query(query, parameters)

    console.log("Update Profile Completed.");
}

export async function addFavorites({ user_id, activity_id, is_favorited }: FavoritesInfo) {
    const date = new Date();
    let parameters: any[] = [user_id, activity_id]
    let query = `
    INSERT INTO user_favorites
        ( user_id, activity_id,last_update )
    VALUES
        ($1, $2, $3)
`;
    if (is_favorited) {
        query = `
        DELETE FROM 
            user_favorites
        WHERE
            user_id = $1 
        AND
            activity_id = $2
        `
    } else {
        parameters.push(date)
    }

    await db.query(query, parameters);

    console.log("activity in user_favorites successfully updated")
}

export async function addPlaylist(playlist_titl: string, user_id: number){
    const date = new Date();
    const query: string = addPlaylistQuery;

    await db.query(query, [user_id, playlist_titl, date]);

    console.log("New playlist created.")
}

//add activities into a playlist
export async function addActivitiesIntoPlaylist(activity_id_arr: number[], user_id: number, playlist_id: number) {
    const date = new Date();
    const check = await db.query(getCurrentActivityCount, [playlist_id]);
    const currentActivityCount: number = parseInt(check.rows[0].count);
 
    const query: string = await getActivityInsertionQuery(activity_id_arr);
    const parameters: any = [];
    let position: number = currentActivityCount + 1;

    for(let activityId of activity_id_arr) {
        parameters.push(activityId, playlist_id, position, date);
        position++;
    }

    await db.query(query, parameters);

    console.log("activities added to a playlist.");
}

export async function removeProfile(user_id: number, email: string) {
    const deleteFavQuery = `
        DELETE FROM 
            user_favorites
        WHERE
            user_id = $1 
    `;
    const deleteProfileQuery = `
        DELETE FROM 
            users
        WHERE 
            user_id = $1 
        AND
            email = $2
    `;

    await db.query(deleteFavQuery, [user_id]);
    await db.query(deleteProfileQuery, [user_id, email]);

    console.log("deleted profile.")
}

export async function removeFavoriteActivity(user_id: number, activity_id: number) {
    const deleteUserActivityQuery = `
        DELETE FROM
            user_favorites
        WHERE
            user_id = $1
        AND 
            activity_id = $2
    `;
    await db.query(deleteUserActivityQuery, [user_id, activity_id]);

    console.log("deleted favorite activity.")
};

export async function deletePlaylist(user_id: number, playlist_id: number){
    const activityDelete = deleteActivitiesQuery;
    const playlistDelete = deletePlaylistQuery;

    await db.query(activityDelete, [playlist_id]);
    await db.query(playlistDelete, [playlist_id, user_id]);

    console.log('deleted playlist.')
}

export async function removeActivityFromPlaylist(playlist_id: number, activity_id: number){
    console.log("activity_id:", activity_id)
    const query = removeActivityFromPlaylistQuery;

    await db.query(query, [activity_id, playlist_id]);

    console.log("remove activity from playlist");
}
