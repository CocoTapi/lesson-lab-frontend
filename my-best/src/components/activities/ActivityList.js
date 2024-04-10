import { Link } from 'react-router-dom';

function ActivityList({ activities }){
    return (
        <div>
            <h1>All Activities</h1>
            <ul>
                {activities.map((activity) => (
                    <li key={activity.activity_id}>
                            <Link to={`/activities/${activity.activity_id}`}>
                                <h2>{activity.title}</h2>
                                <div>{activity.duration}</div>
                                <div>{activity.age_group}</div>
                                <div>{activity.summary}</div>
                                {activity.tags.map((tag) => (
                                    <span key={tag}>{tag} </span>
                                ))}
                            </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
};

export default ActivityList;