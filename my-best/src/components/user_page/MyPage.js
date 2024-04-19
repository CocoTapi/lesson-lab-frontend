import UserActivityList from "./UserActivityList";
import { useSubmit } from "react-router-dom";

function MyPage({ data }){
    console.log(data)
    const userProfile = data.userProfile;
    const userFavorites = data.userFavorites;
    const user_id = userProfile.user_id;
    const submit = useSubmit();

    const handleRemoveActivity = (id, title) => {
        // console.log("handle remove", id, title)
        // const proceed = window.confirm(`Are you sure you want to remove ${title} in your favorites?`);

        // if(proceed) submit(null, { method: 'DELETE', activity_id: id, user_id: user_id});

        console.log("handle remove", id, title);
        const proceed = window.confirm(`Are you sure you want to remove ${title} in your favorites?`);
        
        if (proceed) {
            submit({ activity_id: id, user_id: user_id}, { method: "DELETE" });
        }
    };

    let content;
    if (Object.keys(userFavorites).length === 0) {
        console.log("No content")
        content = "You haven't add favorites."
    } else {
        content = <UserActivityList title='♥ Favorites' userActivityList={userFavorites} onDeleteActivity={handleRemoveActivity} />
    }

    return (
        <div>
            {/* User Name */}
            <div>My Page</div>
            <div>{userProfile.user_name}</div>         

        {/* Favorites */}
            <div>{content}</div>
        {/* uploaded activities */}

        </div>
    )
}

export default MyPage;
