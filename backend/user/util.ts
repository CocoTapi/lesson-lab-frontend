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

export function getUserFavoritesQuery(){
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

export function getUserUploadsQuery(){
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
            JOIN durations As d ON d.duration_id = ad.duration_id 
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

export const updateProfileQuery: string = `
    UPDATE 
        users
    SET
        user_name = $1,
        first_name = $2,
        last_name = $3,
        email = $4,
        password = $5,
        last_update = $6
    WHERE
        email = $7    
    `;

