import ButtonM from "../UI/ButtonM";
import UserActivityList from "./UserActivityList";
import { useSubmit, useRouteLoaderData, useNavigate, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import classes from '../css/user_page/MyFavorites.module.css';
import File from "../UI/File";
import SortBar, { getSortedActivities } from "../UI/SortBar";
import Filter, { getFilteredActivities } from "../UI/Filter";
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
    const [ smallScreen, setSmallScreen] = useState(false);
    const [ selectedDurations, setSelectedDurations ] = useState([]);
    const [ selectedAgeGroups, setSelectedAgeGroups ] = useState([]);
    const [ selectedTags, setSelectedTags ] = useState([]);
    const [ showFilterMenu, setShowFilterMenu ] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1300) {
                setSmallScreen(true);
            } else {
                setSmallScreen(false);
            }
        };

        handleResize();

        // Listen for resize events
        window.addEventListener('resize', handleResize);

        // Clean up
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleEditActivity = (activity_id) => {
        navigate(`/activities/${activity_id}/edit`, { 
            state: { 
                requestedUser_id: user_id, 
                prev_location: location 
            } 
        });
    }; 

    const handleDurationChange = (duration) => {
        setSelectedDurations(duration);
     }
 
     const handleAgeGroupChange = (ageGroup) => {
         setSelectedAgeGroups(ageGroup);
     };
 
     const handleTagChange = (tag) => {
         setSelectedTags(tag);
     }
 
     const handleFilterButton = () => {
         setShowFilterMenu(!showFilterMenu);
     }
 
    let filteredActivities = null;
    let sortedActivities = null;
    let content;

    if (Object.keys(userUploads).length === 0) {
        content = <p>You haven't uploaded activities.</p>
    } else {
        filteredActivities = getFilteredActivities(userUploads, selectedDurations, selectedAgeGroups, selectedTags);
        sortedActivities = getSortedActivities( sortOption, filteredActivities );

        content = sortedActivities.map((activity) => (
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

    let countTitle = 'All';
    if(
        selectedDurations.length > 0 || 
        selectedAgeGroups.length > 0 ||
        selectedTags.length > 0
    ) {
        countTitle = 'Filtered'
    }


    return (
        <File> 
            <div className={classes.outerFrame}>
                <div className={classes.pageTitle}>
                    <h1>My Uploads</h1>
                </div>
                <div className={classes.createPlaylistButtonComponent}>
                    <Link to='../playlists' >
                        <ButtonM colorScheme="secondary">
                            <h2 className={classes.buttonIcon}><MdOutlineAddToPhotos /></h2>
                            <p>Create Playlist</p>
                        </ButtonM>
                    </Link>
                </div>
                <div className={classes.sortBar}>
                    <SortBar onSortChange={setSortOption} colorScheme="primaryLight"/>
                    { smallScreen && 
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
                    { !smallScreen && <h2 className={classes.itemCounts}>{countTitle} Activities : {sortedActivities? sortedActivities.length : 0} items</h2>}

                    {showFilterMenu && (
                        <div style={{ paddingBottom: '0.7rem'}}>
                            <Filter 
                                onDurationsChange={handleDurationChange} 
                                onAgeGroupsChange={handleAgeGroupChange} 
                                onTagsChange={handleTagChange} 
                                selectedDurations={selectedDurations}
                                selectedAgeGroups={selectedAgeGroups}
                                selectedTags={selectedTags}
                                onShowFilterMenu={setShowFilterMenu}
                            />                        
                        </div>
                    )}         
                </div>
                <div className={classes.bottomContents}>
                    <div className={classes.bottomLeft}>
                        {!smallScreen &&
                            <div className={classes.filter}>
                                 <Filter 
                                    onDurationsChange={handleDurationChange} 
                                    onAgeGroupsChange={handleAgeGroupChange} 
                                    onTagsChange={handleTagChange} 
                                    selectedDurations={selectedDurations}
                                    selectedAgeGroups={selectedAgeGroups}
                                    selectedTags={selectedTags}
                                    onShowFilterMenu={setShowFilterMenu}
                                />
                            </div>
                        }
                    { smallScreen && <h2 className={classes.itemCounts}>{countTitle} Activities : {sortedActivities? sortedActivities.length : 0} items</h2>}
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