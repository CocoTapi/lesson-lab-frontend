import Database from "../database/Database";

const db = Database.db;

export async function getPopular100Tags(){
    const first100TagQuery = `
        SELECT 
            t.tag_name, 
            COALESCE(COUNT(at.tag_id), 0) AS count
        FROM 
            tags AS t
        LEFT JOIN 
            activity_tags AS at 
        ON 
            t.tag_id = at.tag_id 
        GROUP BY 
            t.tag_name
        ORDER BY 
            count DESC
        LIMIT 100
    `
    const result = await db.query(first100TagQuery);
    const tags: string[] = result.rows.map((tag: { tag_name: string }) => tag.tag_name);
    
    return tags;
    
}