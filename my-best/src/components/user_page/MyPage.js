import UserActivityList from "./UserActivityList";
//import { useSubmit } from "react-router-dom";

function MyPage({ data }){
    console.log(data)
    const userProfile = data.userProfile;
    const userFavorites = data.userFavorites;
    console.log("userFavorite:", userFavorites);
    //const submit = useSubmit();

    const handleDeleteActivity = (id, title) => {
        console.log("handle delete", id, title)
        // const proceed = window.confirm(`Are you sure you want to delete ${title}?`);

        // if(proceed) submit(null, { method: 'DELETE', activity_id: id});
    };

    let content;
    if (Object.keys(userFavorites).length === 0) {
        console.log("No content")
        content = "You haven't add likes."
    } else {
        content = <UserActivityList title='♥ Likes' userActivityList={userFavorites} onDeleteActivity={handleDeleteActivity} />
    }

    console.log("content". content);

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
