import Accordion from "../UI/Accordion";
import { BiBorderRadius } from "react-icons/bi";

function UserActivityList(props){

    const deleteHandler = (id, title) => {
        props.onDeleteActivity(id, title);
    }

    //TODO:

    // const image = (
    //     <img src='/images/accordionSmall/1.png' alt="example" style={{ borderRadius: '10px' }}/>

    // )

    // const headerContents = (
    //     <>
    //         <div className={classes.detailIcons}>
    //             {activity.is_favorited ? <GoHeartFill /> : <GoHeart />}
    //             {activity.is_saved ? <GoBookmarkFill /> : <GoBookmark /> }
    //         </div>
    //         <p>{activity.summary}</p>
    //         <p>Duration: {activity.duration} mins</p>
    //     </>
    // )

    // const activityDetail = (
    //     <div className={classes.accordionDetail}>
    //         <div className={classes.activityLeft}>
    //             <div>
    //                 <p>Materials :</p>
    //                 <p>{activity.materials}</p>
    //             </div>
    //             <div >
    //                 <p>Age group :</p>
    //                 <p>{activity.age_group}</p>
    //             </div>
    //         </div>
    //         <div className={classes.activityRight}>
    //             <div >
    //                 <p>Objectives:</p>
    //                 <p>{activity.objectives}</p>
    //             </div>
    //             <div >
    //                 <p>Instructions :</p>
    //                 <p>{activity.instructions}</p>
    //             </div>
    //             <div >
    //                 <p>References :</p>
    //                 <p className={classes.accordionReference}>
    //                     <Link to={activity.links}>
    //                         {activity.links}
    //                     </Link>
    //                 </p>
    //             </div>
    //             {activity.tags.map((tag) => (
    //                 <Tag key={tag} tagSize="small" >{tag}</Tag>
    //             ))}
    //         </div>
    //     </div>
    // )

    // let buttonChildren = ''

    // // if (user_id = activity.user_id) {
    //     buttonChildren = (
    //         <ButtonS>
    //             <h4><FaEdit /></h4>
    //             <h4>Edit</h4>
    //         </ButtonS>
    //     )
    // //}
    

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
        // <>
        //     <Accordion 
        //             headerTitle={props.title}
        //             topImage={image}
        //             headerContents={headerContents} 
        //         activityDetail={activityDetail}
        //             buttonChildren={buttonChildren}
        //             color='grey'
        //     />
        // </>
    )
};

export default UserActivityList;