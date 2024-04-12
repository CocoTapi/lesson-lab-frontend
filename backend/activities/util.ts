import Database from "../database/Database";

const db = Database.db;

export async function getTagId(tagName: string) {
    const getTagIdQuery = `
        SELECT tag_id 
        FROM tags 
        WHERE tag_name = $1
    `

    const tagResult = await db.query(getTagIdQuery, [tagName]);

    const tagId = tagResult.rows[0].tag_id;
    if (!tagId) return null;
    return tagId
}

export async function insertTags(tags: string[], activity_id: number){
    const date = new Date;

    for (let tag of tags) {
        const tag_id = await getTagId(tag) ;
            
        if(tag_id) {
            const addTagQuery = `
                INSERT INTO activity_tags (
                    tag_id,
                    activity_id,
                    last_update
                ) 
                VALUES (
                    $1,
                    $2,
                    $3
                );
            `
            await db.query(addTagQuery, [tag_id, activity_id, date])
        } else {
            const createTagIdQuery = `
                WITH inserted_tag AS (
                    INSERT INTO tags (
                        tag_name,
                        last_update
                    )
                    VALUES (
                        $1,
                        $2
                    )
                    RETURNING 
                        tag_id
                ) 
                INSERT INTO activity_tags (
                    tag_id,
                    activity_id,
                    last_update
                )
                VALUES (
                    (SELECT tag_id FROM inserted_tag),
                    $3,
                    $4
                );
            `
            await db.query(createTagIdQuery, [tag, date, activity_id, date]);
        }
    }
}

export function getDeleteAllColumnQuery(table: string){
    const deleteQuery = `
        DELETE FROM 
           ${table}
        WHERE 
            activity_id = $1
    `
    return deleteQuery;
}

