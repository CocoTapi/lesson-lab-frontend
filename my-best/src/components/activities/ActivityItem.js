import { useRouteLoaderData, useSubmit, Link } from "react-router-dom";

function ActivityItem({ activity }){
    const token = useRouteLoaderData();
    const submit = useSubmit();

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
            <div>{activity.ageGroup}</div>
            <div>{activity.summary}</div>
            <div>{activity.objectives}</div>
            <div>{activity.materials}</div>
            <p>{activity.instructions}</p>
            <div>{activity.links}</div>
            {token &&
                <div>
                    <button onClick={handleLike}>Like!!!</button>
                    <Link to="edit" >Edit</Link>
                    <button onClick={() => handleDeleteActivity(activity.title)}>Delete</button>
                </div>                
            }
        </article>
    )
}

export default ActivityItem;