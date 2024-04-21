import { useRouteLoaderData, useSubmit, Link } from "react-router-dom";

function ActivityItem({ activity }) {
    const user = useRouteLoaderData('root');
    let token;
    let user_id;
    if (user) {
        token = user.token;
        user_id = user.user_id;
    }
    const submit = useSubmit();

    const handleAddFavorite = (user_id, is_favorited) => {
        submit({ user_id, is_favorited }, { method: "POST" });
    }

    const handleDeleteActivity = (title) => {
        const proceed = window.confirm(`Are you sure you want to delete ${title}?`);

        if (proceed) submit(null, { method: 'DELETE' });
    }

    // TODO: when user already added the activity as favorite, changed color and avoide action
    console.log(activity)
    return (
        <article>
            <h1>{activity.title}</h1>
            <div>{activity.duration}</div>
            <div>{activity.age_group}</div>
            <div>{activity.summary}</div>
            <div>{activity.objectives}</div>
            <div>{activity.materials}</div>
            <p>{activity.instructions}</p>
            <div>{activity.links}</div>
            {activity.tags.map((tag) => (
                <span key={tag}>#{tag}</span>
            ))}
            {activity.is_favorited &&
                <div>
                    <button
                        style={{ color: 'red' }}
                        onClick={() => handleAddFavorite(user_id, false)}
                    >
                        ♥
                    </button>
                </div>
            }
            {!activity.is_favorited &&
                <div>
                    <button onClick={() => handleAddFavorite(user_id, true)}>♥</button>
                </div>
            }
            <div>
                likes: {activity.like_count}
            </div>
            {token &&
                activity.user_id === user_id &&
                <div>
                    <Link to="edit" >Edit</Link>
                    <button onClick={() => handleDeleteActivity(activity.title)}>Delete</button>
                </div>
            }
        </article>
    )
}

export default ActivityItem;