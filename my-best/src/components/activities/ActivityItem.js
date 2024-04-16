import { useRouteLoaderData, useSubmit, Link } from "react-router-dom";
import { useUserContext } from "../../pages/util/UserProvider";

function ActivityItem({ activity }){
    const token = useRouteLoaderData('root');
    const submit = useSubmit();
    const { userInfo } = useUserContext();
    const user_id = userInfo.user_id;
    console.log("user_id:", user_id )

    // TODO: setup like button
    const handleLike = (e) => {
        e.preventDefault();
        console.log("ADD LIKE!");
    }

    const handleDeleteActivity = (title) => {
        const proceed = window.confirm(`Are you sure you want to delete ${title}?`);

        if(proceed) submit(null, { method: 'DELETE'});
    }

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
            {token &&
                <div>
                    <button onClick={handleLike}>Like!!!</button>
                    <Link to="edit" >Edit</Link>
                    <button onClick={() => handleDeleteActivity(activity.title)}>Delete</button>
                </div>                
            }
            {/* {
                token && 
                activity.user_id === user_id &&
                <div>
                    <Link to="edit" >Edit</Link>
                    <button onClick={() => handleDeleteActivity(activity.title)}>Delete</button>
                </div>
            } */}
        </article>
    )
}

export default ActivityItem;