import Database from "../database/Database";

const db = Database.db;

export async function getAllActivities(){
    const fetchAllSummarizedActivities = `
        SELECT 
            a.title, 
            a.user_id, 
            a.summary, 
            d.duration, 
            age.name AS age_group,
            ARRAY_AGG(tag_name) AS tags
        FROM 
            activities AS a 
            JOIN activity_durations AS ad ON a.activity_id = ad.activity_id 
            JOIN durations As d ON d.duration_id = ad.duration_id 
            JOIN activity_tags As at ON a.activity_id = at.activity_id 
            JOIN tags AS t ON t.tag_id = at.tag_id 
            JOIN activity_age_groups AS aa ON a.activity_id = aa.activity_id
            JOIN age_groups AS age ON age.age_group_id = aa.age_group_id
        GROUP BY 
            a.title, 
            a.user_id, 
            a.summary, 
            d.duration,
            age.name`

    const result = await db.query(fetchAllSummarizedActivities);

    if (result.rows.length <= 0) throw new Error("Activities does not exist")


    return result.rows
}