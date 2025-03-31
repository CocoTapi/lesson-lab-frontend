import PageHeader from "../UI/PageHeader";

function ActivityNavigation(){
    const token = null;

    return (
        <PageHeader title='Activities' token={token} link={'/activities'} />     
    )
}

export default ActivityNavigation;