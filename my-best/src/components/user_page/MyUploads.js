import ButtonM from "../UI/ButtonM";
import UserActivityList from "./UserActivityList";
import { useSubmit, useRouteLoaderData, redirect } from "react-router-dom";
import { useState } from "react";
import classes from '../css/user_page/MyUploads.module.css';
import File from "../UI/File";
import SortBar from "../UI/SortBar";
import Filter from "../UI/Filter";
import { MdOutlineAddToPhotos } from "react-icons/md";
import { FaEdit } from "react-icons/fa";



function MyUploads({ data }){
    const userUploads = data.userUploads;
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

    const handleRemoveActivity = (id, title) => {
        const proceed = window.confirm(`Are you sure you want to remove ${title} in your Uploads?`);

        if (proceed) {
            submit({ activity_id: id, user_id: user_id}, { method: "DELETE" });
        }
    }; 

    const handleEditActivity = (activity_id, user_id) => {
        
    }

    console.log("userUploads: ", userUploads);

    let content;
    if (Object.keys(userUploads).length === 0) {
        console.log("No content")
        content = <p>"You haven't add activities."</p>
    } else {
        content = userUploads.map((activity) => (
            <li key={activity.activity_id}>
                <UserActivityList 
                    activity={activity}  
                    onDeleteActivity={handleRemoveActivity}
                    icon={<FaEdit />}
                    buttonWord='Edit'
                    onEdit={handleEditActivity}
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
                                <h3>Go-to-list</h3>
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

export default MyUploads;