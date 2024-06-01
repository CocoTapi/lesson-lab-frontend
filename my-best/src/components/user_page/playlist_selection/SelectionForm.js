import { useState, useEffect } from "react";
import classes from '../../css/user_page/SelectionFromFav.module.css';
import SortBar, { getSortedActivities } from "../../UI/SortBar";
import Filter, { getFilteredActivities } from "../../UI/Filter";
import Tag from "../../UI/Tag";
import { MdOutlineFilterCenterFocus } from "react-icons/md";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FaChevronDown } from "react-icons/fa";
import ButtonS from "../../UI/ButtonS";
import { loadUserFavorites } from "../../../pages/user_page/UserFavoritesPage";
import { loadUserUploads } from "../../../pages/user_page/UserUploadsPage";
import UserActivityList from "../UserActivityList";

//TODO: fetch only activities that is not in the playlist

function SelectionForm({ selectedList, playlist_id, user_id, onSubmitActivities, title, onClose}){
    const [ activityList, setActivityList ] = useState([]);
    const [ selectedActivities, setSelectedActivities ] = useState([]);
    const [ sortOption, setSortOption ] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedAgeGroup, setSelectedAgeGroup ] = useState('');
    const [selectedTag, setSelectedTag ] = useState('');
    const [ showFilterMenu, setShowFilterMenu ] = useState(false);

    useEffect(() => {
        let response;
        const fetchActivityData = async() => {
            if(selectedList === 'like') {
                response = await loadUserFavorites(user_id);
                setActivityList(response.userFavorites)
            } else if (selectedList === 'upload') {
                response = await loadUserUploads(user_id)
                setActivityList(response.userUploads)
            }
        };

        fetchActivityData();
    }, [user_id, selectedList])

    const handleSelectionChange = (event) => {
        const value = event.target.value;

        setSelectedActivities(prevSelectedActivities => 
            prevSelectedActivities.includes(value) 
                ? prevSelectedActivities.filter(activity => activity !== value) 
                : [...prevSelectedActivities, value]
        );
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if(selectedActivities.length > 0) {
            onSubmitActivities(selectedActivities, user_id, playlist_id);
        } else {
            onClose()
        }
    }

    //handle filter functions
    const handleTimeChange = (time) => {
        setSelectedTime(time);
    }

    const handleAgeGroupChange = (ageGroup) => {
        setSelectedAgeGroup(ageGroup);
    };

    const handleTagChange = (tag) => {
        setSelectedTag(tag);
    }

    const handleFilterButton = () => {
        setShowFilterMenu(!showFilterMenu);
    }

    const filteredActivities = getFilteredActivities(activityList, selectedTime, selectedAgeGroup, selectedTag);

    const sortedActivities = getSortedActivities( sortOption, filteredActivities );



    let content;
    if (Object.keys(sortedActivities).length === 0) {
        console.log("No Activities")
        content = <p>You haven't {selectedList}ed activities yet.</p>
    } else {
        content = sortedActivities.map((activity) => (
            <label key={activity.activity_id} className={classes.checkContainer}>
                <input
                    type="checkbox"
                    name="activityCheck"
                    value={activity.activity_id}
                    onChange={handleSelectionChange}
                    className={classes.customCheck}
                />
                <UserActivityList 
                    activity={activity} 
                />
            </label>
        ))       
    }

    return (
        <div className={classes.selectionContents}>
            <div>
                <h3>Add to Playlist : {title}</h3>
                <ButtonS onClick={handleSubmit}>Done</ButtonS>
            </div>
            {selectedList === 'like' ? 
                <h4>My Likes</h4> : 
                <h4>My Uploads</h4>
            }
            <SortBar onSortChange={setSortOption} />
            <div className={classes.filterButtons} onClick={handleFilterButton} >
                <div className={classes.fButton}>
                    <Tag hash='false'>
                        <MdOutlineFilterCenterFocus className={classes.fIcon} />
                        <p>Filter</p>
                        {showFilterMenu ? <IoIosCloseCircleOutline className={classes.closeIcon}/> : <FaChevronDown className={classes.fIcon} /> }
                    </Tag>
                </div>
            </div>
            {showFilterMenu && (
                <div>
                    <Filter onTimeChange={handleTimeChange} onAgeChange={handleAgeGroupChange} onTagChange={handleTagChange}/>
                </div>
            )}    
            <h4 className={classes.itemCounts}>{sortedActivities.length} items</h4>
            <form>
                <div>
                {content}
                </div>
                <div>
                    <ButtonS onClick={handleSubmit}>Done</ButtonS>
                </div>
            </form>
        </div>
    )
}

export default SelectionForm;

// function SelectionForm({ data, playlist_id, subTitle }){
//     //const userFavorites = data.userFavorites;
//     // const userPlaylistsData = useRouteLoaderData('user-playlists');
//     // const playlist = userPlaylistsData.data.userPlaylists.filter(playlist => playlist.playlist_id === playlist_id)[0];
//     const submit = useSubmit();
//     const [ smallDisplay, setSmallDisplay] = useState(false);
    // const [ sortOption, setSortOption ] = useState('');
    // const [selectedTime, setSelectedTime] = useState('');
    // const [selectedAgeGroup, setSelectedAgeGroup ] = useState('');
    // const [selectedTag, setSelectedTag ] = useState('');
//     const [ showFilterMenu, setShowFilterMenu ] = useState(false);
//     const [ addingList, setAddingList ] = useState([]);
//     const navigate = useNavigate();


    
//     console.log("userFavorites, selection", data);
//     // console.log("playlist, selection", playlist);
//     console.log("selectedPlaylist", playlist_id);

//     const user = useRouteLoaderData('root');
//     let token;
//     let user_name;
//     let user_id;
//     if(user) {
//         token = user.token;
//         user_name = user.user_name
//         user_id = user.user_id;
//     }

//     useEffect(() => {
//         const handleResize = () => {
//             if (window.innerWidth <= 640) {
//                 setSmallDisplay(true);
//             } else {
//                 setSmallDisplay(false);
//             }
//         };

//         handleResize();

//         // Listen for resize events
//         window.addEventListener('resize', handleResize);

//         // Clean up
//         return () => window.removeEventListener('resize', handleResize);
//     }, []);


//     //toggle activity in the adding list
//     const handletoggleActivity = (activity_id) => {
//         setAddingList((prevList) => {
//             const index = prevList.indexOf(activity_id);

//             if(index > -1) {
//                 return prevList.filter(id => id !== activity_id)
//             } else {
//                 return [...prevList, activity_id]
//             }
//         })
//     };

//     //submit selected activities
//     const handleSubmit = () => {
//         console.log("clicked")
//         if(addingList.length > 0) {
//             submit({ activity_id_list: addingList, playlist_id, user_id}, { method: "POST"});
//         }
//         navigate(`/mypage/${user_id}/playlists`);
//     }

    //  //handle filter functions
    //  const handleTimeChange = (time) => {
    //     setSelectedTime(time);
    //  }
 
    //  const handleAgeGroupChange = (ageGroup) => {
    //      setSelectedAgeGroup(ageGroup);
    //  };
 
    //  const handleTagChange = (tag) => {
    //      setSelectedTag(tag);
    //  }
 
    //  const handleFilterButton = () => {
    //      setShowFilterMenu(!showFilterMenu);
    //  }
 
    //  const filteredActivities = getFilteredActivities(data, selectedTime, selectedAgeGroup, selectedTag);

    //  const sortedActivities = getSortedActivities( sortOption, filteredActivities );

//     let content;
//     if (Object.keys(data).length === 0) {
//         console.log("No content")
//         content = <p>"You haven't add favorites."</p>
//     } else {
//         content = sortedActivities.map((item) => (
//             <li key={item.activity_id}>
//                 <Accordion 
//                     headerTitle={item.title}
//                     headerContents={
//                         <div>
//                             <div className={classes.durationGroup} >
//                                 <p className={classes.labelTitle} >Duration :</p>
//                                 <p className={classes.info} >{item.duration} mins</p>
//                             </div>
//                         </div>
//                     }
//                     topImage={ 
//                         <div className={classes.customList}>
//                             <img src='/images/accordionSmall/1.png' alt="example" style={{ borderRadius: '10px' }}/>
//                         </div>
//                     }
//                     activityDetail={
//                         <div className={classes.accordionDetail}>
//                             <div className={classes.leftDetailItems}>
//                                 <div className={classes.detailItem}>
//                                     <p className={classes.labelTitle}>Materials :</p>
//                                     <p>{item.materials}</p>
//                                 </div>
//                             </div>
//                             <div className={classes.rightDetailItems}>
//                                 <div className={classes.detailItem}>
//                                     <p className={classes.labelTitle}>Summary :</p>
//                                     <p>{item.summary}</p>
//                                 </div>
//                                 <div className={classes.detailItem}>
//                                     <p className={classes.labelTitle}>Objectives :</p>
//                                     <p>{item.objectives}</p>
//                                 </div>
//                                 <div className={classes.detailItem}>
//                                     <p className={classes.labelTitle}>Instructions :</p>
//                                     <p>{item.instructions}</p>
//                                 </div>
//                                 <div className={classes.detailItem}>
//                                     <p className={classes.labelTitle}>References :</p>
//                                     <p className={classes.accordionReference}>
//                                         {item.links ? 
//                                             <Link to={item.links}>
//                                                 {item.links}
//                                             </Link> 
//                                         : <p>none</p>
//                                         }
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     }
//                 />
//                 <button onClick={() => handletoggleActivity(item.activity_id)}>
//                     {addingList.includes(item.activity_id) ? <FaCheck /> : <FaPlus />}
//                 </button> 
//             </li>
//         ))       
//     }
    

//     return (
//         <File>
//             <div className={classes.whiteFrame}>
//                 <div className={classes.frameContent}>
                    // <div>
                    //     <h2>Add to this Playlist</h2>
                    //     <ButtonS onClick={handleSubmit}>Done</ButtonS>
                    // </div>
                    // <h3>{subTitle}</h3>
                    // <SortBar onSortChange={setSortOption} />
                    // <div className={classes.filterButtons} onClick={handleFilterButton} >
                    //     <div className={classes.fButton}>
                    //         <Tag hash='false'>
                    //             <MdOutlineFilterCenterFocus className={classes.fIcon} />
                    //             <p>Filter</p>
                    //             {showFilterMenu ? <IoIosCloseCircleOutline className={classes.closeIcon}/> : <FaChevronDown className={classes.fIcon} /> }
                    //         </Tag>
                    //     </div>
                    // </div>
                    // {showFilterMenu && (
                    //     <div>
                    //         <Filter onTimeChange={handleTimeChange} onAgeChange={handleAgeGroupChange} onTagChange={handleTagChange}/>
                    //     </div>
                    // )}    
                    // <h4 className={classes.itemCounts}>{sortedActivities.length} items</h4>
                    // <ul>
                    //     {content}
                    // </ul>
//                 </div>
    
               
        
                
               
                 


                  
//             </div>
       
//         </File>
//     )
// }

// export default SelectionForm;