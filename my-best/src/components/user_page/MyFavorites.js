import ButtonM from "../UI/ButtonM";
import UserActivityList from "./UserActivityList";
import { useSubmit, useRouteLoaderData, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import classes from '../css/user_page/MyFavorites.module.css';
import File from "../UI/File";
import SortBar, { getSortedActivities } from "../UI/SortBar";
import Filter, { getFilteredActivities } from "../UI/Filter";
import { MdOutlineAddToPhotos } from "react-icons/md";
import { GoTrash } from "react-icons/go";
import Tag from '../UI/Tag';
import { MdOutlineFilterCenterFocus } from "react-icons/md";
import { GoHeartFill } from "react-icons/go";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

function MyFavorites({ data }){
    const userFavorites = data.userFavorites;
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
    const [ showFilterButton, setShowFilterButton] = useState(false);
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedAgeGroup, setSelectedAgeGroup ] = useState('');
    const [selectedTag, setSelectedTag ] = useState('');
    const [ showFilterMenu, setShowFilterMenu ] = useState(false);

    //handle screen size change
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

    //action: remove activity
    const handleRemoveActivity = (activity_id, title) => {
        const proceed = window.confirm(`Are you sure you want to remove ${title} in your favorites?`);
    
        if (proceed) {
            submit({ activity_id, user_id}, { method: "DELETE" });
        }
    }; 

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
 
     const filteredActivities = getFilteredActivities(userFavorites, selectedTime, selectedAgeGroup, selectedTag);

     const sortedActivities = getSortedActivities( sortOption, filteredActivities );

    let content;
    if (Object.keys(userFavorites).length === 0) {
        console.log("No content")
        content = <p>"You haven't add favorites."</p>
    } else {
        content = sortedActivities.map((activity) => (
            <li key={activity.activity_id}>
                <UserActivityList 
                    activity={activity}  
                    onClick={handleRemoveActivity}
                    icon={<GoTrash />}
                    buttonWord='Remove'
                />
            </li>
        ))       
    }

    let countTitle = 'All';
    if(
        selectedTime.length > 0 || 
        selectedAgeGroup.length > 0 ||
        selectedTag.length > 0
    ) {
        countTitle = 'Filtered'
    }

    return (
        <File> 
            <div className={classes.outerFrame}>
                <div className={classes.pageTitle}>
                    <GoHeartFill className={classes.titleIcon} />
                    <h1>Likes</h1>
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
                       <h2 className={classes.itemCounts}>{countTitle} Activities : {sortedActivities.length} items</h2>
                    </div>
                    <ul className={classes.bottomRight}>
                        {content}
                    </ul>
                </div>
            </div>
        </File>
       
    )
}

export default MyFavorites;