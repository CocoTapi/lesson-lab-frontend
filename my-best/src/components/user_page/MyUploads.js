import UserActivityList from "./UserActivityList";

function MyUploads({ data }){
    const userUploads = data.userUploads;

    let content;
    if (Object.keys(userUploads).length === 0) {
        console.log("No content")
        content = "You haven't uploaded any activity yet."
    } else {
        content =  <UserActivityList title='Uploaded Activities' userActivityList={userUploads} />
    }

    console.log("content". content);
    return (
        <div>
            {content}
        </div>
    )
}

export default MyUploads;