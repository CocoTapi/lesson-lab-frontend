import Database from "../database/Database";
import { ActivityFormInfo, ErrorMessage } from "../util/types";
import { isValidAgeGroup, isValidDuration, isValidLinks, isValidTags, isValidText, isValidUrl } from "../util/validation";
import { getDeleteAllColumnQuery, getUpdateQueryForNestedTable, insertTags } from "./util";

const db = Database.db;

//TODO: can I add "asyncHandler" here?

export async function getAllActivities(){
    const getSummaryQuery = `
        SELECT 
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
        GROUP BY 
            a.activity_id,
            a.user_id, 
            a.title, 
            a.summary, 
            d.duration_title,
            age.age_group_title
        `

    const result = await db.query(getSummaryQuery);

    if (result.rows.length <= 0) throw new Error("Activities does not exist")


    return result.rows
}

export async function getActivityDetail(id: number){
    const getDetailQuery = `
        SELECT 
            a.user_id, 
            a.title, 
            a.summary, 
            d.duration_title AS duration, 
            age.age_group_title AS age_group,
            a.objectives,
            a.materials,
            a.instructions,
            a.links,
            ARRAY_AGG(tag_title) AS tags
        FROM 
            activities AS a 
            JOIN activity_durations AS ad ON a.activity_id = ad.activity_id 
            JOIN durations As d ON d.duration_id = ad.duration_id 
            JOIN activity_tags As at ON a.activity_id = at.activity_id 
            JOIN tags AS t ON t.tag_id = at.tag_id 
            JOIN activity_age_groups AS aa ON a.activity_id = aa.activity_id
            JOIN age_groups AS age ON age.age_group_id = aa.age_group_id
        WHERE 
            a.activity_id = $1
        GROUP BY 
            a.user_id, 
            a.title, 
            a.summary, 
            d.duration_title,
            age.age_group_title,
            a.objectives,
            a.materials,
            a.instructions,
            a.links
        `
    
    const result = await db.query(getDetailQuery, [id]);

    if (result.rows.length <= 0) throw new Error("Activities does not exist")

    return result.rows;
}


export async function checkFormValidation({title, summary, duration, age_group, objectives, materials, instructions, links, tags}: ActivityFormInfo){
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
            (SELECT duration_id FROM durations WHERE duration_title = $2),
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
            (SELECT age_group_id FROM age_groups WHERE age_group_title = $2),
            $3
        );`
    
    await db.query(addAgeGroupQuery, [
        activity_id, age_group, date
    ]) 
    
    //insurt tags into db
    console.log("start inserting tags");
    
    if (tags && tags.length > 0) {
        await insertTags(tags, activity_id)
    }

    console.log("Added activity");
};

export async function editActivity(activity_id: number, updateData: ActivityFormInfo){
    console.log("start editting");
    //get previous Data from activity_id
    const result = await getActivityDetail(activity_id);
    const prevData = result[0];
    const date = new Date();

    console.log("prevData:", prevData);
    console.log("updateData:", updateData);

    //check if there is the activity added by same user
    if (prevData.user_id !== updateData.user_id) throw Error("Could not find activity to edit for current user")
    
    let statements: string[] = [];
    let otherParameters:any[] = [];

    for (const key in prevData) {
        if (prevData[key] !== updateData[key]) {
            switch (key) {
                case 'duration':
                    const durationQuery: string = getUpdateQueryForNestedTable('duration');
                    const durationParameters: number[] = [updateData.duration, activity_id];

                    await db.query(durationQuery, durationParameters);
                    console.log("done duration");
                    break;
                case 'age_group':
                    const ageGroupQuery : string = getUpdateQueryForNestedTable('age_group');
                    const ageGroupParameters: [string, number] = [updateData.age_group, activity_id];

                    await db.query(ageGroupQuery, ageGroupParameters);
                    console.log("done age_group");
                    break;
                case 'tags':
                    await tagsUpdate(activity_id, prevData[key], updateData[key]);
                    console.log("done tags");

                    break;
                default:
                    statements.push(`${key} = $${statements.length + 1}`);
                    otherParameters.push(updateData[key]);
            }
        }
    }

    //update activity table
    if (statements.length === 0) return
   
    const activityUpdateQuery = `
        UPDATE activities
        SET ${statements.join(', ')}
        WHERE activity_id = $${otherParameters.length + 1}
    `;
    otherParameters.push(activity_id);

    await db.query(activityUpdateQuery, otherParameters);

    console.log("edit done");
};

async function tagsUpdate(id: number, prevData: string[], updateData: string[]){
    console.log("start tags update")
    let addedTags: string[] = [];
    let removedTags: string[] = [];

    for (let tag of updateData){
        if (!prevData.includes(tag)) {
            addedTags.push(tag);
        }
    };

    for (let tag of prevData) {
        if (!updateData.includes(tag)){
            removedTags.push(tag)
        }
    };
    console.log("addedTags:", addedTags);
    console.log("removedTags:", removedTags);


    if (addedTags.length > 0) {
        insertTags(addedTags, id)
    }

    if (removedTags.length > 0) {
        for (let tag of removedTags){
            const deleteTagQuery = `
                DELETE FROM activity_tags
                WHERE activity_id = $1 
                AND tag_id = (SELECT tag_id FROM tags WHERE tag_title = $2)
            `
            await db.query(deleteTagQuery, [id, tag]);
        
        }
    }
    console.log("tag updae done");
}


export async function  removeActivity(id: number){
    const deleteDurationQuery = getDeleteAllColumnQuery("activity_durations")
    const deleteAgeGroupQuery = getDeleteAllColumnQuery("activity_age_groups") 
    const deleteTagsQuery = getDeleteAllColumnQuery("activity_tags")
    const deleteActivityQuery = getDeleteAllColumnQuery("activities");

    await db.query(deleteDurationQuery, [id]);
    await db.query(deleteAgeGroupQuery, [id]);
    await db.query(deleteTagsQuery, [id]);
    await db.query(deleteActivityQuery, [id]);
   
    console.log("deleted activity.")
}