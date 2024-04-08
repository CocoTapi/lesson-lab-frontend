import { useRouteLoaderData } from "react-router-dom";

function ActivityItem({ activity }){
    const token = useRouteLoaderData();

    const handleLike = (e) => {
        e.preventDefault();
        console.log("ADD LIKE!");
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
                <button onClick={handleLike}>Like!!!</button>
            }
        </article>
    )
}

export default ActivityItem;