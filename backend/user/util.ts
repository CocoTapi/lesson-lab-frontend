import { UserPlaylistResult, FormattedPlaylist } from "../util/types";

export const userProfileQuery: string = `
    SELECT 
        user_id,
        user_name,
        email, 
        password,
        first_name,
        last_name,
        last_login
    FROM 
        users
    WHERE 
        email = $1
    `;

export const countSameTextQuery: string = `
    SELECT 
        COUNT(*) 
    FROM users
    WHERE 
        user_name = $1 
    AND 
        user_id != $2;
`;

export function getUserFavoritesQuery() {
    const query = `
        SELECT 
            uf.user_id,
            a.activity_id,
            a.user_id,
            a.title, 
            a.summary, 
            d.duration_title AS duration, 
            age.age_group_title AS age_group,
            ARRAY_AGG(tag_title) AS tags,
            a.objectives,
            a.materials,
            a.instructions,
            a.links,
            CAST(
                (SELECT COUNT(*)
                 FROM user_favorites uf
                 WHERE uf.activity_id = a.activity_id
                ) AS INTEGER
            ) AS like_count
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
            age.age_group_title,
            a.objectives,
            a.materials,
            a.instructions,
            a.links
    `;

    return query;
}

export function getUserUploadsQuery() {
    const query = `
        SELECT 
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
            JOIN durations AS d ON d.duration_id = ad.duration_id 
            JOIN activity_tags As at ON a.activity_id = at.activity_id 
            JOIN tags AS t ON t.tag_id = at.tag_id 
            JOIN activity_age_groups AS aa ON a.activity_id = aa.activity_id
            JOIN age_groups AS age ON age.age_group_id = aa.age_group_id
        WHERE a.user_id = $1
        GROUP BY 
            a.activity_id, 
            a.user_id,
            a.title, 
            a.summary, 
            d.duration_title,
            age.age_group_title
    `;

    return query;
};

export function updateProfileQuery(password: string | null){
    let passwordChange = '';

    if (password !== null) {
        passwordChange = `,
        password = $7
        `;
    }

    const query: string = `
        UPDATE 
            users
        SET
            user_name = $1,
            first_name = $2,
            last_name = $3,
            email = $4,
            last_update = $5
            ${passwordChange}
        WHERE
            email = $6    
        `;

        return query;
}

export function getUserPlaylistsQuery() {

    //need to be "LEFT JOIN" for playlist which has no activities yet
    const query: string = `
        SELECT 
            p.playlist_id,
            p.playlist_title,
            p.user_id,
            pa.activity_id,
            pa.position,
            a.title,
            a.summary,
            d.duration_title AS duration,
            a.instructions,
            a.objectives,
            a.materials,
            a.links
        FROM 
        playlists AS p
        LEFT JOIN 
            playlist_activities AS pa ON p.playlist_id = pa.playlist_id
        LEFT JOIN 
            activities AS a ON pa.activity_id = a.activity_id
        LEFT JOIN 
            activity_durations AS ad ON a.activity_id = ad.activity_id 
        LEFT JOIN 
            durations AS d ON d.duration_id = ad.duration_id 
        WHERE p.user_id = $1
        GROUP BY 
            p.playlist_id,
            pa.activity_id,
            a.title,
            a.summary,
            d.duration_title,
            a.instructions,
            a.objectives,
            a.materials,
            a.links,
            pa.position
        Order BY
            playlist_id ASC,
            pa.position ASC
    `;

    return query; 
}

/*
export function getUserPlaylistsQuery() {
    const query = `
        SELECT 
            p.playlist_id,  
            u.user_name,
            p.playlist_title,
            ARRAY_AGG(a.activity_id) AS activity_ids,
            ARRAY_AGG(a.title) AS activity_titles,
            ARRAY_AGG(a.summary) AS summaries,
            ARRAY_AGG(d.duration_title) AS durations,
            ARRAY_AGG(a.instructions) AS instructions,
            ARRAY_AGG(a.objectives) AS objectives,
            ARRAY_AGG(a.materials) AS materials,
            ARRAY_AGG(a.links) AS links,
            SUM(d.duration_title) AS total_duration
        FROM 
            users AS u
        LEFT JOIN 
            playlists AS p ON u.user_id = p.user_id
        LEFT JOIN 
            playlist_activities AS pa ON p.playlist_id = pa.playlist_id
        LEFT JOIN
            activities AS a ON pa.activity_id = a.activity_id
        LEFT JOIN 
            activity_durations AS ad ON a.activity_id = ad.activity_id 
        LEFT JOIN 
            durations AS d ON d.duration_id = ad.duration_id 
        WHERE 
            u.user_id = $1
        GROUP BY 
            p.playlist_id, 
            u.user_name, 
            p.playlist_title
        ORDER BY
			p.playlist_id ASC
        LIMIT 10
    `;

    return query;
}
*/

export const addPlaylistQuery = `
    INSERT INTO 
        playlists (user_id, playlist_title, create_date)
    VALUES
        ($1, $2, $3)
`

export const getCurrentActivityCount = `
    SELECT COUNT(*) FROM playlist_activities
    WHERE playlist_id = $1
`

export async function getActivityInsertionQuery(arr: number[]){
    let query = `
        INSERT INTO playlist_activities 
            (activity_id, playlist_id, position, last_update)
        VALUES
            ($1, $2, $3, $4)
    `;

    for(let i = 1; i < arr.length; i++) {
        let startNum: number = 4*i + 1;
        let stringToAdd = `
            ,($${startNum}, $${startNum + 1}, $${startNum + 2}, $${startNum + 3})
        ` 
        query = query + stringToAdd;
    }

    return query;
}

export async function reformatPlaylistData(playlists: UserPlaylistResult[]) {
    const map: any = {};

    playlists.forEach((list: UserPlaylistResult) => {
        const { playlist_id, playlist_title, user_id, ...activityDetails } = list;

        if(!map[playlist_id]) {
            map[playlist_id] = {
                playlist_id,
                playlist_title,
                user_id,
                total_duration: 0,
                activities: [],
            }
        };

        map[playlist_id].activities.push(activityDetails);
        map[playlist_id].total_duration += activityDetails.duration;
    })

    return Object.values(map) as FormattedPlaylist[];
}

// export async function reformatActivityData(playlists: UserPlaylist[]) {
//     const activities: any = [];
//     console.log(playlists)
//     playlists.forEach((playlist: UserPlaylist) => {
//         const { user_name, playlist_title, activity_ids, activity_titles, summaries, durations } = playlist;
//         activity_ids.forEach((activity_id, index) => {
//             activities.push({
//                 activity_id,
//                 activity_title: activity_titles[index],
//                 activity_summary: summaries[index],
//                 activity_duration: durations[index]
//             });
//         });
//     });

//     return activities;
// }

export const deleteActivitiesQuery = `
    DELETE FROM 
        playlist_activities
    WHERE
        playlist_id = $1
`

export const deletePlaylistQuery = `
    DELETE FROM 
        playlists
    WHERE
        playlist_id = $1
    AND 
        user_id = $2
`
export const removeActivityFromPlaylistQuery = `
    DELETE FROM 
        playlist_activities
    WHERE
        activity_id = $1
    AND 
        playlist_id = $2
`