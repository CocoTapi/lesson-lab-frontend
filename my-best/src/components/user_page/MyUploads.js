import ButtonM from "../UI/ButtonM";
import UserActivityList from "./UserActivityList";
import { useSubmit, useRouteLoaderData, useNavigate, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import classes from '../css/user_page/MyFavorites.module.css';
import File from "../UI/File";
import SortBar from "../UI/SortBar";
import Filter from "../UI/Filter";
import { MdOutlineAddToPhotos } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import Tag from '../UI/Tag';
import { MdOutlineFilterCenterFocus } from "react-icons/md";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";




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
    const navigate = useNavigate();
    const location = useLocation();
    const [ showFilterButton, setShowFilterButton] = useState(false);
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedAgeGroup, setSelectedAgeGroup ] = useState('');
    const [selectedTag, setSelectedTag ] = useState('');
    const [ showFilterMenu, setShowFilterMenu ] = useState(false);


    //TODO: handle sortOption

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1300) {
                setShowFilterButton(true);
            } else {
                setShowFilterButton(false);
            }
        };

        handleResize();

        // Listen for resize events
        window.addEventListener('resize', handleResize);

        // Clean up
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    //TODO: sort 

    const handleEditActivity = (activity_id) => {
        navigate(`/activities/${activity_id}/edit`, { 
            state: { 
                requestedUser_id: user_id, 
                prev_location: location 
            } 
        });
    }; 

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
 
     const filteredActivities = userUploads.filter((activity) => {
         const timeMatch = selectedTime ? activity.duration === parseInt(selectedTime): true;
         const ageGroupMatch = selectedAgeGroup ? activity.age_group === selectedAgeGroup : true;
         const tagMatch = selectedTag ? activity.tags.includes(selectedTag) : true;
         return timeMatch && ageGroupMatch && tagMatch;
     });


    // console.log("userUploads: ", userUploads);

    let content;
    if (Object.keys(userUploads).length === 0) {
        console.log("No content")
        content = <p>"You haven't add activities."</p>
    } else {
        content = filteredActivities.map((activity) => (
            <li key={activity.activity_id}>
                <UserActivityList 
                    activity={activity}  
                    onClick={handleEditActivity}
                    icon={<FaEdit />}
                    buttonWord='Edit'
                />
            </li>
        ))       
    }


    return (
        <File> 
            <div className={classes.outerFrame}>
                <div className={classes.pageTitle}>
                    <h1>My Uploads</h1>
                </div>
                <div className={classes.sortBar}>
                    <SortBar onSortChange={setSortOption} colorScheme="primaryLight"/>
                    { showFilterButton && 
                        <div className={classes.filterButtons} onClick={handleFilterButton} >
                            <div className={classes.fButton}>
                                <Tag hash='false'>
                                    <MdOutlineFilterCenterFocus className={classes.fIcon} />
                                    <p>Filter</p>
                                    {showFilterMenu ? <FaChevronUp className={classes.fIcon} /> : <FaChevronDown className={classes.fIcon} /> }
                                </Tag>
                            </div>
                        </div>
                    }
                    {showFilterMenu && (
                        <div style={{ paddingBottom: '0.7rem'}}>
                            <Filter onTimeChange={handleTimeChange} onAgeChange={handleAgeGroupChange} onTagChange={handleTagChange}/>
                        </div>
                    )}         
                </div>
                <div className={classes.bottomContents}>
                    <div className={classes.bottomLeft}>
                        {!showFilterButton &&
                            <div className={classes.filter}>
                                <Filter />
                            </div>
                        }
                       <div className={classes.createPlaylistButtonComponent}>
                        <Link to='../playlists' >
                                <ButtonM colorScheme="secondary">
                                    <h2 className={classes.buttonIcon}><MdOutlineAddToPhotos /></h2>
                                    <p>Create Playlist</p>
                                </ButtonM>
                            </Link>
                       </div>
                    </div>
                    <ul className={classes.bottomRight}>
                        {content}
                    </ul>
                </div>
            </div>
        </File>
       
    )
}

export default MyUploads;