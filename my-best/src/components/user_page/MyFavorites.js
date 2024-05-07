import Accordion from "../UI/Accordion";
import ButtonS from "../UI/ButtonS";
import ButtonM from "../UI/ButtonM";
import UserActivityList from "./UserActivityList";
import { useSubmit, Link } from "react-router-dom";
import { IoTrashBinSharp } from "react-icons/io5";
import { GoHeartFill, GoBookmark, GoBookmarkFill } from "react-icons/go";
import { useState } from "react";
import classes from '../css/user_page/MyFavorites.module.css';
import Tag from "../UI/Tag";
import File from "../UI/File";
import SortBar from "../UI/SortBar";
import Filter from "../UI/Filter";
import { MdOutlineAddToPhotos } from "react-icons/md";


function MyFavorites({ data }){
    console.log(data)
    const userProfile = data.userProfile;
    const userFavorites = data.userFavorites;
    const user_id = userProfile.user_id;
    const submit = useSubmit();
    const [ sortOption, setSortOption ] = useState('shortToLong');
    //TODO: sort 

    const handleRemoveActivity = (id, title) => {
        const proceed = window.confirm(`Are you sure you want to remove ${title} in your favorites?`);

        if (proceed) {
            submit({ activity_id: id, user_id: user_id}, { method: "DELETE" });
        }
    }; 

//      //TODO: set top image
//      const topImage = (
//         <div>image</div>
//         //<img src='../../public/images/AccordionSmall/1.png' alt="example" style={{ borderRadius: '12px' }} />
//     )

// const headerContents = (item) => {
//     return (
//     <div>
//         <div className={classes.detailIcons}>
//             <GoHeartFill />
//             <GoBookmark />
//             {/* {activity.is_saved ? <GoBookmarkFill /> : <GoBookmark /> } */}
//         </div>
//         <div className={classes.createrInfo}>
//             {/* <p>{activity.like_count} likes</p> */}
//             <p>20 likes</p>
//             <p>user name here</p>
//         </div> 
//         <div>
//             <p>{item.summary}</p>
//         </div>
//         <div>
//             <p>Durations :</p>
//             <p>{item.duration}</p>
//         </div>
//     </div>
// )}

//     const activityDetail = (item) => {
//         return (
//         <div>
//             <div className={classes.left}>
//                 <div className={classes.leftItem}>
//                     <p>Materials :</p>
//                     <p>{item.materials}</p>
//                 </div>
//                 <div className={classes.leftItem}>
//                     <p>Age group :</p>
//                     <p>{item.age_group}</p>
//                 </div>
//                 <div className={classes.leftTags}>
//                     {item.tags.map((tag) => (
//                     <Tag key={tag} className={classes.tagFrame} tagSize='small' >{tag}</Tag>
//                     ))}
//                 </div>
//             </div>
//             <div className={classes.right}>
//                 <div className={classes.rightItem}>
//                     <p>Objectives:</p>
//                     <p>{item.objectives}</p>
//                 </div>
//                 <div className={classes.rightItem}>
//                     <p>Instructions :</p>
//                     <p>{item.instructions}</p>
//                 </div>
//                 <div className={classes.rightItem}>
//                     <p>References :</p>
//                     <p className={classes.reference}>
//                         <Link to={item.links}>
//                             {item.links}
//                         </Link>
//                     </p>
//                 </div>
//             </div>
//         </div>
//     )}

//     const buttonChildren = (item) => {
//         return (
//             <ButtonS onClick={() => handleRemoveActivity(item.activity_id, item.title)} >
//                 <h4><IoTrashBinSharp /></h4>
//                 <h4>Remove</h4>
//             </ButtonS>
//     ) }

    console.log("userFavorites: ", userFavorites);

    let content;
    if (Object.keys(userFavorites).length === 0) {
        console.log("No content")
        content = <p>"You haven't add favorites."</p>
    } else {
        content = userFavorites.map((activity) => (
            <li key={activity.activity_id}>
                <UserActivityList 
                    activity={activity}  
                    onDeleteActivity={handleRemoveActivity}
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
                        <div>
                            <Filter />
                        </div>
                       <div className={classes.goToList}>
                            <ButtonM colorScheme="secondary">
                                <h2><MdOutlineAddToPhotos /></h2>
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

export default MyFavorites;