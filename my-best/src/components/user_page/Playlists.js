import { useState } from "react";
import { useSubmit, useRouteLoaderData } from "react-router-dom";
import { IoTrashBinSharp } from "react-icons/io5";
import Accordion from "../UI/Accordion";
import { TiPlus } from "react-icons/ti";
import UserActivityList from "./UserActivityList";
import File from "../UI/File";
import SortBar from "../UI/SortBar";
import Filter from "../UI/Filter";
import ButtonM from "../UI/ButtonM";
import { MdOutlineAddToPhotos } from "react-icons/md";
import classes from '../css/user_page/Playlists.module.css';

function Playlists ({ data }) {
    const userPlaylists = data.userPlaylists;
    const user = useRouteLoaderData('root');
    let token;
    let user_name;
    let user_id;
    if(user) {
        token = user.token;
        user_name = user.user_name
        user_id = user.user_id;
    }
    const submit = useSubmit();
    const [ sortOption, setSortOption ] = useState('shortToLong');
    //TODO: sort 

    const handleRemoveActivity = (activity_id, title) => {
        const proceed = window.confirm(`Are you sure you want to remove ${title} in your playlist?`);
    
        if (proceed) {
            submit({ activity_id, user_id}, { method: "DELETE" });
        }
    }; 

    console.log("userPlaylists: ", userPlaylists);

    const headerContents = (
        <div>
            <p>Duration :</p>
            <p>{userPlaylists.total_duration} mins</p>
        </div>
    )

    const topImage = (
        <div className={classes.sum}>{userPlaylists.total_duration}</div>
    )

    const activityDetail = (
        <ul>
            {userPlaylists.activity_list.map((activity) => (
                <li key={activity.activity_id}>
                <UserActivityList 
                    activity={activity}  
                    onClick={handleRemoveActivity}
                    icon={<IoTrashBinSharp />}
                    buttonWord='Remove'
                />
            </li>
            )

            )}
        </ul>
    )

    const handleAddActivity = (e) => {
        e.preventDefault();
        console.log("add activity!")
    }

    const buttonChildren = (
        <button onClick={handleAddActivity} >
             <TiPlus />
        </button>
    )

    let content;
    if (Object.keys(userPlaylists).length === 0) {
        console.log("No content")
        content = <p>"You haven't create playlists."</p>
    } else {
        content = userPlaylists.map((list) => (
            <li key={list.list_id}>
                <Accordion 
                    headerTitle={list.title}
                    headerContents={headerContents}
                    topImage={topImage}
                    activityDetail={activityDetail}
                    buttonChildren={buttonChildren}
                />
            </li>
        ))       
    }


    return (
        <File> 
            <div className={classes.frame}>
                <div className={classes.sortBar}>
                    <SortBar onSortChange={setSortOption} colorScheme="primaryLight"/>
                </div>
                <div className={classes.contents}>
                    <div className={classes.left}>
                        <div className={classes.filter}>
                            <Filter />
                        </div>
                       <div className={classes.goToList}>
                            <ButtonM colorScheme="secondary">
                                <h2 className={classes.buttonIcon}><MdOutlineAddToPhotos /></h2>
                                <p>Create Playlists</p>
                            </ButtonM>
                       </div>
                    </div>
                    <ul className={classes.right}>
                        {content}
                    </ul>
                </div>
            </div>
        </File>
    )
       
}

export default Playlists;