import ButtonM from "../UI/ButtonM";
import UserActivityList from "./UserActivityList";
import { useSubmit, useRouteLoaderData, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import classes from '../css/user_page/MyFavorites.module.css';
import File from "../UI/File";
import SortBar, { getSortedActivities } from "../UI/SortBar";
import Filter, { getFilteredActivities } from "../UI/Filter";
import { MdOutlineAddToPhotos } from "react-icons/md";
import Tag from '../UI/Tag';
import { MdOutlineFilterCenterFocus } from "react-icons/md";
import { GoHeartFill, GoTrash } from "react-icons/go";
import { FaChevronDown } from "react-icons/fa";
import { IoIosCloseCircleOutline } from "react-icons/io";
import Swal from "sweetalert2";


function MyFavorites({ data }){
    const userFavorites = data;
    
    const user = useRouteLoaderData('root');
    const user_id = user ? user.user_id : 'guest';

    const submit = useSubmit();
    const [ sortOption, setSortOption ] = useState('');
    const [ smallScreen, setSmallScreen] = useState(false);
    const [ selectedDurations, setSelectedDurations ] = useState([]);
    const [ selectedAgeGroups, setSelectedAgeGroups ] = useState([]);
    const [ selectedTags, setSelectedTags ] = useState([]);
    const [ showFilterMenu, setShowFilterMenu ] = useState(false);


    //handle screen size change
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

    //action: remove activity
    const handleRemoveActivity = (activity_id, title) => {
        Swal.fire({
        title: "Are you sure?",
        text: `Do you want to unlike this activity"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ff9603",
        cancelButtonColor: "#55555",
        confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                submit({ activity_id, user_id}, { method: "DELETE" });
            }
        });
    }; 

    //handle filter functions
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
    
    if (Object.keys(userFavorites).length === 0) {
        content = <p className={classes.noContent}>You haven't added activities.</p>
    } else {
        filteredActivities = getFilteredActivities(userFavorites, selectedDurations, selectedAgeGroups, selectedTags);
        sortedActivities = getSortedActivities( sortOption, filteredActivities );

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
        selectedDurations.length > 0 || 
        selectedAgeGroups.length > 0 ||
        selectedTags.length > 0
    ) {
        countTitle = 'Filtered'
    }

    return (
        <File> 
            <div className={classes.outerFrame}>
                {/* file title */}
                <div className={classes.pageTitle}>
                    <GoHeartFill className={classes.titleIcon} />
                    <h1>Likes</h1>
                </div>

                {/* create button */}
                <div className={classes.createPlaylistButtonComponent}>
                    <Link to='../playlists' >
                        <ButtonM colorScheme="secondary">
                            <h2 className={classes.buttonIcon}><MdOutlineAddToPhotos /></h2>
                            <p>Create Playlist</p>
                        </ButtonM>
                    </Link>
                </div>

                {/* sort bar */}
                <div className={classes.sortBar}>
                    <SortBar onSortChange={setSortOption} colorScheme="primaryLight"/>
                    { smallScreen && 
                        <div className={classes.filterButtons} onClick={handleFilterButton} >
                            <div className={classes.fButton}>
                                <Tag hash='false'>
                                    <MdOutlineFilterCenterFocus />
                                    <p>Filter</p>
                                    {showFilterMenu ? <IoIosCloseCircleOutline className={classes.fIcon} /> : <FaChevronDown  /> }
                                </Tag>
                            </div>
                        </div>
                    }
                    { !smallScreen && <h2 className={classes.itemCounts}>{countTitle} Activities : {sortedActivities? sortedActivities.length : 0} items</h2>}

                    {showFilterMenu && (
                        <div className={classes.filterContentFrame}>
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

export default MyFavorites;