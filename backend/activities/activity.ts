import Database from "../database/Database";
import { ActivityFormInfo, ErrorMessage } from "../util/types";
import { isValidAgeGroup, isValidDuration, isValidLinks, isValidTags, isValidText, isValidUrl } from "../util/validation";
import {
    getDeleteAllColumnQuery,
    getInsertQueryForNestedTable,
    getUpdateQueryForNestedTable,
    insertTags,
    deleteUserFavQuery,
    getSummaryRelationQuery,
    addActivitiesQuery,
    getUserActivityRelationQuery,
    getFilteredSummaryRelationQuery
} from "./util";

const db = Database.db;

export async function getAllActivities() {
    const query = getSummaryRelationQuery();

    const result = await db.query(query);

    if (result.rows.length <= 0) throw new Error("Activities does not exist")

    return result.rows
}

export async function getAllActivitiesUser(verifiedEmail: string){
    const query = getSummaryRelationQuery(verifiedEmail);

    const result = await db.query(query, [verifiedEmail]);

    if (result.rows.length <= 0) throw new Error("Activities does not exist");

    return result.rows
}


export async function getFilteredActivitiesUser(verifiedEmail: string, searchTerm: string) {
    const query = getFilteredSummaryRelationQuery(verifiedEmail);

    const searchTermForFTS: string = searchTerm.split(' ').join(' & ');

    const result = await db.query(query, [searchTermForFTS, searchTerm, verifiedEmail]);

    if (result.rows.length <= 0) return [];

    return result.rows;
}

export async function getFilteredActivities(searchTerm: string) {
    const query = getFilteredSummaryRelationQuery();

    const searchTermForFTS = searchTerm.split(' ').join(' & ');

    const result = await db.query(query, [searchTermForFTS, searchTerm]);

    if (result.rows.length <= 0) return [];

    return result.rows
}

export async function getActivityDetailUser(activity_id: number, verifiedEmail?: string) {
    let query; let parameters: any[] = [activity_id];

    query = getUserActivityRelationQuery(verifiedEmail);
    if (verifiedEmail) {
        parameters.push(verifiedEmail);
    }

    const result = await db.query(query, parameters);

    if (result.rows.length <= 0) throw new Error("Activities does not exist")

    return result.rows;
}

export async function getActivityDetail(activity_id: number) {
    let parameters: any[] = [activity_id];
    const query = getUserActivityRelationQuery();

    const result = await db.query(query, parameters);

    if (result.rows.length <= 0) throw new Error("Activities does not exist")

    return result.rows;
}

export async function checkFormValidation({ title, summary, duration, age_group, objectives, materials, instructions, links, tags }: ActivityFormInfo) {
    let errors: ErrorMessage = {};
    if (!isValidText(title)) errors.title = "Invalid title.";
    if (!isValidText(summary)) errors.summary = "Invalid summary.";
    if (!isValidDuration(duration)) errors.duration = "Invalid duration. Choose one from selections";
    if (!isValidAgeGroup(age_group)) errors.age_group = "Invalid age group. Choose one from selections.";
    if (!isValidText(objectives)) errors.objectives = "Invalid objectives.";
    if (!isValidText(materials)) errors.materials = "Invalid materials.";
    if (!isValidText(instructions)) errors.instructions = "Invalid instructions.";
    if (isValidLinks(links) === false) errors.links = "Invalid links";
    if (!isValidTags(tags)) errors.tags = "Invalid tags. Add at least one tag.";

    if (Object.keys(errors).length > 0) return errors;

    console.log("Passed all form validations!");
    return {};
}



export async function addActivity({ user_id, title, summary, duration, age_group, objectives, materials, instructions, links, tags }: ActivityFormInfo) {
    //TODO: check trim or formatting the data? 

    console.log("start adding activity");
    const date = new Date();

    //insert everything except duration, age_group, tags
    await db.query(addActivitiesQuery, [
        user_id, title, summary, objectives, materials,
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
        user_id, title
    ]);

    const activity_id: number = result.rows[0].activity_id;
    if (!activity_id) throw Error("activity doesn't exist in db.");
    console.log("activity_id: ", activity_id);

    //insert duration
    console.log("start adding duration");
    const durationQuery = getInsertQueryForNestedTable("duration");

    await db.query(durationQuery, [
        activity_id, duration, date
    ])

    //insert age_group
    console.log("start adding age_group");
    console.log(age_group);
    const addAgeGroupQuery = getInsertQueryForNestedTable("age_group");

    await db.query(addAgeGroupQuery, [
        activity_id, age_group, date
    ])

    //insurt tags into db
    console.log("start inserting tags");

    if (tags && tags.length > 0) {
        await insertTags(tags, activity_id, date)
    }

    console.log("Added activity");
};

export async function editActivity(activity_id: number, updateData: ActivityFormInfo) {
    console.log("start editting");
    //get previous Data from activity_id
    const result = await getActivityDetail(activity_id);
    const prevData = result[0];
    const date = new Date();

    console.log("prevData:", prevData);
    console.log("user sent form:", updateData);

    //check if there is the activity added by same user
    if (prevData.user_id !== updateData.user_id) throw Error("Could not find activity to edit for current user")

    let statements: string[] = [];
    let otherParameters: any[] = [];

    //if new input is different from previous data, update
    for (const key in prevData) {
        if (prevData[key] !== updateData[key]) {
            switch (key) {
                case 'duration':
                    const durationQuery: string = getUpdateQueryForNestedTable('duration');
                    const durationParameters = [updateData.duration, date, activity_id];

                    await db.query(durationQuery, durationParameters);
                    console.log("done duration");
                    break;
                case 'age_group':
                    const ageGroupQuery: string = getUpdateQueryForNestedTable('age_group');
                    const ageGroupParameters = [updateData.age_group, date, activity_id];

                    await db.query(ageGroupQuery, ageGroupParameters);
                    console.log("done age_group");
                    break;
                case 'tags':
                    await tagsUpdate(activity_id, prevData[key], updateData[key], date);
                    console.log("done tags");

                    break;
                case 'like_count':
                    break
                default:
                    statements.push(`${key} = $${statements.length + 1}`);
                    otherParameters.push(updateData[key]);
            }
        }
    }

    //update activity table
    if (statements.length === 0) {
        console.log('update done.')
        return
    }

    console.log("statements.join", statements.join(', '));
    console.log("lastUpdateNum", otherParameters.length + 1)

    const activityUpdateQuery = `
        UPDATE 
            activities
        SET 
            ${statements.join(', ')},
            last_update = $${otherParameters.length + 1}
        WHERE 
            activity_id = $${otherParameters.length + 2}
    `;
    otherParameters.push(date);
    otherParameters.push(activity_id);

    console.log("activityUpdateParameter:", activityUpdateQuery);
    console.log("otherParameters:", otherParameters);

    await db.query(activityUpdateQuery, otherParameters);

    console.log("edit done");
};

async function tagsUpdate(id: number, prevData: string[], updateData: string[], date: Date) {
    console.log("start tags update")
    let addedTags: string[] = [];
    let removedTags: string[] = [];

    for (let tag of updateData) {
        if (!prevData.includes(tag)) {
            addedTags.push(tag);
        }
    };

    for (let tag of prevData) {
        if (!updateData.includes(tag)) {
            removedTags.push(tag)
        }
    };
    console.log("addedTags:", addedTags);
    console.log("removedTags:", removedTags);


    if (addedTags.length > 0) {
        insertTags(addedTags, id, date);
    }

    if (removedTags.length > 0) {
        for (let tag of removedTags) {
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


export async function removeActivity(id: number) {
    const deleteDurationQuery = getDeleteAllColumnQuery("activity_durations")
    const deleteAgeGroupQuery = getDeleteAllColumnQuery("activity_age_groups")
    const deleteTagsQuery = getDeleteAllColumnQuery("activity_tags")
    const deleteActivityQuery = getDeleteAllColumnQuery("activities");

    await db.query(deleteUserFavQuery, [id]);
    await db.query(deleteDurationQuery, [id]);
    await db.query(deleteAgeGroupQuery, [id]);
    await db.query(deleteTagsQuery, [id]);
    await db.query(deleteActivityQuery, [id]);

    console.log("deleted activity.")
}