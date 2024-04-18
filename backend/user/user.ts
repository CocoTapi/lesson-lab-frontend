import Database from "../database/Database";
import bcrypt from "bcrypt";
import { ProfileInfo } from "../util/types";
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

    if (!(result.rows.length > 0)) throw Error("Could not get user profile.");
  
    const userProfile = result.rows[0];
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
            d.duration_title, 
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

    if (!(result.rows.length > 0)) throw Error("User doesn't exist.");
    const userFavorites = result.rows;
    return userFavorites;
}


export async function editProfile(prevEmail: string, updateData: ProfileInfo) {
    const date = new Date();
    const hashResult = bcrypt.hashSync(updateData.password, saltRounds);
    if (!hashResult) throw new Error('Password hash fail. User not created')
    
        const updateProfileQuery = `
        UPDATE 
            users
        SET
            email = $1,
            password = $2,
            first_name = $3,
            last_name = $4,
            last_update = $5
        WHERE
            email = $6    
    `;

    await db.query(updateProfileQuery, [
        updateData.email,
        hashResult,
        updateData.firstName,
        updateData.lastName,
        date,
        prevEmail
    ])

    console.log("Update Profile Completed.");
} 
