import UserActivityList from "./UserActivityList";
import { useRouteLoaderData, useSubmit } from "react-router-dom";

function MyUploads({ data }){
    const userUploads = data.userUploads;
    const submit = useSubmit();
    const user = useRouteLoaderData('root');
    let user_id;
    if(user) {
        user_id = user.user_id;
    }

    const handleDeleteActivity = (activity_id, title) => {
        const proceed = window.confirm(`Are you sure you want to delete ${title}?`);
        
        if (proceed) {
            submit({ activity_id: activity_id, user_id: user_id}, { method: "DELETE" });
        }
    };

    let content;
    if (Object.keys(userUploads).length === 0) {
        console.log("No content")
        content = "You haven't uploaded any activity yet."
    } else {
        content =  <UserActivityList 
            title='Uploaded Activities' 
            userActivityList={userUploads} 
            onDeleteActivity={handleDeleteActivity}
        />
    }

    return (
        <div>
            {content}
        </div>
    )
}

export default MyUploads;