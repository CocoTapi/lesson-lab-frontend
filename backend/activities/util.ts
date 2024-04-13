import Database from "../database/Database";

const db = Database.db;

export async function getTagId(tag: string) {
    const getTagIdQuery = `
        SELECT tag_id 
        FROM tags
        WHERE tag_title = $1
    `

    const result = await db.query(getTagIdQuery, [tag]);
    console.log("result:", result.rows);

    if (result.rows.length === 0) {
       return 0;
    } 

    const id = result.rows[0].tag_id;
    return id;
}

export async function insertTags(tags: string[], activity_id: number){
    const date = new Date;

    for (let tag of tags) {
        const tag_id: number = await getTagId(tag) ;
            
        if(tag_id > 0) {
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
        } else if(tag_id === 0){
            const createTagIdQuery = `
                WITH inserted_tag AS (
                    INSERT INTO tags (
                        tag_title,
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

export function getUpdateQueryForNestedTable(subject: string) {
        const updateQuery = `
        UPDATE activity_${subject}s
        SET ${subject}_id = (SELECT ${subject}_id FROM ${subject}s WHERE ${subject}_title = $1)
        WHERE activity_id = $2
    `;
    return updateQuery;
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



