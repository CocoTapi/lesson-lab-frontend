import Database from "../database/Database";
import { ActivityFormInfo, ErrorMessage } from "../util/types";
import { isValidAgeGroup, isValidDuration, isValidLinks, isValidTags, isValidText, isValidUrl } from "../util/validation";

const db = Database.db;

export async function getAllActivities(){
    const query = `
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

    const result = await db.query(query);

    if (result.rows.length <= 0) throw new Error("Activities does not exist")


    return result.rows
}

export async function getActivityDetail(id: string){
    const query = `
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
    
    const result = await db.query(query);

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

    const date = new Date();
    const queryForActivity = `
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
           ($1, $2, $3, $4, $5, $6, $7, &8, &9)
        RETURNING
            activity_id
    `


    const result = await db.query(queryForActivity, [
        userId, title, summary, objectives, materials, instructions, links, date, date
    ])

    const activity_id = result.rows[0];
    
    // TODO: add duration, age_group, tags

    console.log("Added activity");
}

export async function editActivity(activity_id: number, {userId, title, summary, duration, age_group, objectives, materials, instructions, links, tags}: ActivityFormInfo){
   //TODO: update activity info
}

export async function removeActivity(id: number){
    const query = `
        DELETE FROM 
            activities
        WHERE 
            activity_id = $1
        DELETE FROM 
            activity_durations
        WHERE 
            activity_id = $1
        DELETE FROM 
            activity_age_groups
        WHERE 
            activity_id = $1
        DELETE FROM
            activity_tags
        WHERE 
            activity_id = $1
    `

    await db.query(query, [id])
    console.log("deleted activity.")
}