function UserActivityList(props){

    const deleteHandler = (id, title) => {
        props.onDeleteActivity(id, title);
    }
    

    return (
        <div>
        <h1>{props.title}</h1>
        <ul>
            {props.userActivityList.map((activity) => (
                <li key={activity.activity_id}>
                    <h2>{activity.title}</h2>
                    <div>{activity.duration}</div>
                    <div>{activity.age_group}</div>
                    <div>{activity.summary}</div>
                    {activity.tags.map((tag) => (
                        <span key={tag}>{tag} </span>
                    ))}
                    <button onClick={() => deleteHandler(activity.activity_id, activity.title)}>Remove</button>
                </li>
            ))}
        </ul>
    </div>
    )
};

export default UserActivityList;