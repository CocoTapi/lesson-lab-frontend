import Database from "../database/Database";
import { ActivityFormInfo, ErrorMessage } from "../util/types";
import { isValidAgeGroup, isValidDuration, isValidLinks, isValidTags, isValidText, isValidUrl } from "../util/validation";

const db = Database.db;

//TODO: can I add "asyncHandler" here?

export async function getAllActivities(){
    const getSummaryQuery = `
        SELECT 
            a.activity_id,
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
            a.activity_id,
            a.title, 
            a.user_id, 
            a.summary, 
            d.duration,
            age.name
        `

    const result = await db.query(getSummaryQuery);

    if (result.rows.length <= 0) throw new Error("Activities does not exist")


    return result.rows
}

export async function getActivityDetail(id: string){
    const getDetailQuery = `
        SELECT 
            a.title, 
            a.user_id, 
            a.summary, 
            d.duration, 
            age.name AS age_group,
            a.objectives,
            a.materials,
            a.instructions,
            a.links,
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
            age.name,
            a.objectives,
            a.materials,
            a.instructions,
            a.links
        `
    
    const result = await db.query(getDetailQuery);

    if (result.rows.length <= 0) throw new Error("Activities does not exist")

    return result.rows;
}


export async function checkAFormValidation({title, summary, duration, age_group, objectives, materials, instructions, links, tags}: ActivityFormInfo){
    let errors: ErrorMessage = {};

    if(!isValidText(title)) errors.title = "Invalid title.";
    if(!isValidText(summary)) errors.summary = "Invalid summary.";
    if(!isValidDuration(duration)) errors.duration = "Invalid duration. Choose one from selections";
    if(!isValidAgeGroup(age_group)) errors.age_group = "Invalid age group. Choose one from selections.";
    if(!isValidText(objectives)) errors.objectives = "Invalid objectives.";
    if(!isValidText(materials)) errors.materials = "Invalid materials.";
    if(!isValidText(instructions)) errors.instructions = "Invalid instructions.";
    if(isValidLinks(links) === false) errors.links = "Invalid links";
    if(!isValidTags(tags)) errors.tags = "Invalid tags. Add at least one tag.";

    if (Object.keys(errors).length > 0) return errors;

    console.log("Passed all validations!");
    return {}; 
}

export async function addActivity({userId, title, summary, duration, age_group, objectives, materials, instructions, links, tags}: ActivityFormInfo){
    //TODO: check trim or formatting the data? 

    //insert everything except duration, age_group, tags
    console.log("start adding activity");
    const date = new Date();
    const addActivitiesQuery = `
        INSERT INTO activities (
            user_id, 
            title, 
            summary, 
            objectives, 
            materials, 
            instructions, 
            links, 
            create_date, 
            last_update
        ) 
        VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING
            activity_id
        `
    await db.query(addActivitiesQuery, [
        userId, title, summary, objectives, materials,
        instructions, links, date, date
    ])

    //get activity_id
    console.log("start getting activity_id");
    const getActivityIdQuery = `
        SELECT activity_id 
        FROM activities 
        WHERE user_id = $1 AND title = $2
    `
    const result = await db.query(getActivityIdQuery, [
        userId, title
    ]);

    const activity_id: number = result.rows[0].activity_id;
    if(!activity_id) throw Error("activity doesn't exist in db.");
    console.log("activity_id: ", activity_id);

    //insert duration
    console.log("start adding duration");
    const addDurationQuery =  `
        INSERT INTO activity_durations (
            activity_id, 
            duration_id,
            last_update
        ) 
        VALUES (
            $1, 
            (SELECT duration_id FROM durations WHERE duration = $2),
            $3
        );`
    
    await db.query(addDurationQuery, [
        activity_id, duration, date
    ]) 

    //insert age_group
    console.log("start adding age_group");
    const addAgeGroupQuery = `
        INSERT INTO activity_age_groups (
            activity_id, 
            age_group_id,
            last_update
        ) 
        VALUES (
            $1, 
            (SELECT age_group_id FROM age_groups WHERE name = $2),
            $3
        );`
    
    await db.query(addAgeGroupQuery, [
        activity_id, age_group, date
    ]) 
    
    //insurt tags into db
    console.log("start inserting tags");
    try {
        if (tags && tags.length > 0) {
            for (let tag of tags) {
                const getTagIdQuery = `
                    SELECT tag_id 
                    FROM tags 
                    WHERE tag_name = $1
                `

                const tagResult = await db.query(getTagIdQuery, [tag]);
                
                if(tagResult.rows[0]) {
                    const tag_id = tagResult.rows[0].tag_id;
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
    } catch (error) {
        console.log("Error inserting tags:", error)
        throw Error("inserting tags failed.")
    }



    console.log("Added activity");
}

export async function editActivity(activity_id: number, {userId, title, summary, duration, age_group, objectives, materials, instructions, links, tags}: ActivityFormInfo){
   //TODO: update activity info
}

export async function removeActivity(id: number){
    const deleteDurationQuery = `
        DELETE FROM 
            activity_durations
        WHERE 
            activity_id = $1
    `
    const deleteAgeGroupQuery = `
        DELETE FROM 
            activity_age_groups
        WHERE 
            activity_id = $1
    `
    const deleteTagsQuery = `     
        DELETE FROM
            activity_tags
        WHERE 
            activity_id = $1
    `
    const deleteActivityQuery = `
        DELETE FROM 
            activities
        WHERE 
            activity_id = $1
    `

    try {
        await db.query(deleteDurationQuery, [id]);
        await db.query(deleteAgeGroupQuery, [id]);
        await db.query(deleteTagsQuery, [id]);
        await db.query(deleteActivityQuery, [id]);
    } catch(error){
        console.log("Error deleting activity:", error)
        throw Error("deleting activity failed.")
    } 

    console.log("deleted activity.")
}