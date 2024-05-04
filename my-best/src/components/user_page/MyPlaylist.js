import { Link } from "react-router-dom"
import Tag from "../UI/Tag"
import { IoTrashBinSharp } from "react-icons/io5"
import Accordion from "../UI/Accordion"

function MyPlaylist () {
    const image = (
        <img src='/images/accordionsmall/1.png' alt="example" style={{ borderRadius: '10px' }}/>

    )

    const headerContents = (
        <>
            <p>{activity.summary}</p>
            <p>Duration: {activity.duration} mins</p>
        </>
    )

    const activityDetail = (
        <div className={classes.accordionDetail}>
            <div className={classes.activityLeft}>
                <div>
                    <p>Materials :</p>
                    <p>{activity.materials}</p>
                </div>
                <div >
                    <p>Age group :</p>
                    <p>{activity.age_group}</p>
                </div>
            </div>
            <div className={classes.activityRight}>
                <div >
                    <p>Objectives:</p>
                    <p>{activity.objectives}</p>
                </div>
                <div >
                    <p>Instructions :</p>
                    <p>{activity.instructions}</p>
                </div>
                <div >
                    <p>References :</p>
                    <p className={classes.accordionReference}>
                        <Link to={activity.links}>
                            {activity.links}
                        </Link>
                    </p>
                </div>
                {activity.tags.map((tag) => (
                    <Tag key={tag} tagSize="small" >{tag}</Tag>
                ))}
            </div>
        </div>
    )

    let buttonChildren = ''

    // if (user_id = activity.user_id) {
        buttonChildren = (
            <button className={classes.deleteButton}>
                <h4><IoTrashBinSharp /></h4>
            </button>
        )
    //}

    return (
        <div>
            <Accordion 
                    headerTitle={activity.title}
                    topImage={image}
                    headerContents={headerContents} 
                activityDetail={activityDetail}
                    buttonChildren={buttonChildren}
                    color='grey'
            />
        </div>
    )
}

export default MyPlaylist;