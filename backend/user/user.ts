import Database from "../database/Database";
import bcrypt from "bcrypt";
import { ErrorMessage, FavoritesInfo, ProfileInfo } from "../util/types";
import env from 'dotenv';
import { isValidEmail, isValidPassword, isValidText } from "../util/validation";

env.config();
const db = Database.db;
const saltRounds = parseInt(process.env.SALTROUNDS as string);

export async function getUserDataFromEmail(email: string){
    const query = `
      SELECT 
        user_id,
        user_name
      FROM 
        users
      WHERE 
        email = $1
    `;
    const result = await db.query(query, [email]);

    if (!(result.rows.length > 0)) throw Error("User doesn't exist.");
  
    const userInfo = result.rows[0];
    return userInfo;
}

export async function getUserProfile(email: string){
    const userProfileQuery = `
    SELECT 
        user_id,
        user_name,
        email, 
        password,
        first_name,
        last_name,
        last_login,
        user_name
    FROM 
        users
    WHERE 
        email = $1
    `;

    const result = await db.query(userProfileQuery, [email]);
    //console.log("email:", email);
    //console.log("result:", result);

    if (!(result.rows.length > 0)) throw Error("Could not get user profile.");
  
    const userProfile = result.rows[0];

    delete userProfile.password;
    
    return userProfile;
}

export async function getUserFavorites(user_id: number) {
    const userFavoritesQuery = `
        SELECT 
            uf.user_id,
            a.activity_id,
            a.user_id,
            a.title, 
            a.summary, 
            d.duration_title AS duration, 
            age.age_group_title AS age_group,
            ARRAY_AGG(tag_title) AS tags
        FROM 
            activities AS a 
            JOIN activity_durations AS ad ON a.activity_id = ad.activity_id 
            JOIN durations As d ON d.duration_id = ad.duration_id 
            JOIN activity_tags As at ON a.activity_id = at.activity_id 
            JOIN tags AS t ON t.tag_id = at.tag_id 
            JOIN activity_age_groups AS aa ON a.activity_id = aa.activity_id
            JOIN age_groups AS age ON age.age_group_id = aa.age_group_id
            JOIN user_favorites AS uf ON uf.activity_id = a.activity_id
        WHERE uf.user_id = $1
        GROUP BY 
            uf.user_id,
            a.activity_id, 
            a.user_id,
            a.title, 
            a.summary, 
            d.duration_title,
            age.age_group_title
    `;

    const result = await db.query(userFavoritesQuery, [user_id]);

    let userFavorites = {};

    //when user does not have any favorite activities
    if (!(result.rows.length > 0)) return userFavorites;
    
    userFavorites = result.rows;

    return userFavorites;
}

export async function checkUserNameValidation(formData: string, user_id: number) {
    const errors: ErrorMessage = {};

    const textValidity = isValidText(formData, 2);

    if(!textValidity) {
        errors.user_name = "Invalid user name.";
        return errors;
    }
    
    const sameCount: number = await isTextUnique(formData, user_id);
    console.log("same count", sameCount);

    if(sameCount > 0) {
        errors.user_name = "This user name is already used. Try different name.";
        return errors
    }

    console.log("Pass Unique user name check.")
    return {}
}

async function isTextUnique(user_name: string, user_id: number){
    const countSameTextQuery = `
        SELECT 
            COUNT(*) 
        FROM users
        WHERE 
            user_name = $1 
        AND 
            user_id != $2;
    `;

    const result = await db.query(countSameTextQuery, [user_name, user_id]);
    if (!(result.rows.length > 0)) throw Error("Could not fetch the number of same text columns.");

    const sameCount: number = result.rows[0].count;
    console.log(sameCount);

    return sameCount;
}


export async function editProfile(prevEmail: string, updateData: ProfileInfo) {
    const date = new Date();
    const hashResult = bcrypt.hashSync(updateData.password, saltRounds);
    if (!hashResult) throw new Error('Password hash fail. User not created')
    
        const updateProfileQuery = `
        UPDATE 
            users
        SET
            user_name = $1,
            first_name = $2,
            last_name = $3,
            email = $4,
            password = $5,
            last_update = $6
        WHERE
            email = $7    
    `;

    await db.query(updateProfileQuery, [
        updateData.user_name,
        updateData.first_name,
        updateData.last_name,
        updateData.email,
        hashResult,
        date,
        prevEmail
    ])

    console.log("Update Profile Completed.");
} 

export async function addFavorites({user_id, activity_id}: FavoritesInfo){
    const date = new Date();
    const addFavoriteQuery = `
        INSERT INTO user_favorites
            ( user_id, activity_id,last_update )
        VALUES
            ($1, $2, $3)
    `;

    await db.query(addFavoriteQuery, [user_id, activity_id, date]);

    console.log("add activity in user_favorites")
}

export async function removeProfile(user_id: number, email: string) {
    const deleteProfileQuery = `
        DELETE FROM 
            users
        WHERE 
            user_id = $1 
        AND
            email = $2
    `
    await db.query(deleteProfileQuery, [user_id, email]);

    console.log("deleted profile.")
}
