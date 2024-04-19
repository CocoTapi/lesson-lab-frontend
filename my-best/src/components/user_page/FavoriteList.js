function FavoriteList({ userFavorites }){
    return (
        <div>
        <h1>♥ Likes</h1>
        <ul>
            {userFavorites.map((activity) => (
                <li key={activity.activity_id}>
                    <h2>{activity.title}</h2>
                    <div>{activity.duration}</div>
                    <div>{activity.age_group}</div>
                    <div>{activity.summary}</div>
                    {activity.tags.map((tag) => (
                        <span key={tag}>{tag} </span>
                    ))}
                </li>
            ))}
        </ul>
    </div>
    )
};

export default FavoriteList;