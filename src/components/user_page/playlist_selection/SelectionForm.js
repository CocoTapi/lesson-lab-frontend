import { useState, useEffect, useMemo } from "react";
import classes from '../../css/user_page/SelectionForm.module.css';
import SortBar, { getSortedActivities } from "../../UI/SortBar";
import Filter, { getFilteredActivities } from "../../UI/Filter";
import Tag from "../../UI/Tag";
import { MdOutlineFilterCenterFocus } from "react-icons/md";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FaChevronDown } from "react-icons/fa";
import ButtonS from "../../UI/ButtonS";
import { loadUserFavorites } from "../../../pages/user_page/UserFavoritesPage";
import { loadUserUploads } from "../../../pages/user_page/UserUploadsPage";
import { loadActivities } from "../../../pages/activities/ActivitiesPage";
import UserActivityList from "../UserActivityList";
import TopButton from "../../UI/TopButton";

function SelectionForm({ selectedList, playlist_id, user_id, onSubmitActivities, title, onClose, onBackToSelection, current_activity_ids }){
    const [ activityList, setActivityList ] = useState([]);
    const [ selectedActivities, setSelectedActivities ] = useState([]);
    const [ sortOption, setSortOption ] = useState('');
    const [ selectedDurations, setSelectedDurations ] = useState([]);
    const [ selectedAgeGroups, setSelectedAgeGroups ] = useState([]);
    const [ selectedTags, setSelectedTags ] = useState([]);
    const [ showFilterMenu, setShowFilterMenu ] = useState(false);
    const [selectedDurationTotal, setSelectedDurationTotal] = useState(0);

    useEffect(() => {
        let response;
        const fetchActivityData = async() => {
            if(selectedList === 'like') {
                response = await loadUserFavorites(user_id);
                setActivityList(response.userFavorites)
            } else if (selectedList === 'upload') {
                response = await loadUserUploads(user_id);
                setActivityList(response.userUploads);
            } else if (selectedList === 'allActivities') {
                response = await loadActivities();
                setActivityList(response)
            }
        };

        fetchActivityData();
    }, [user_id, selectedList])

    const handleSelectionChange = (event, activity) => {
        const activityId = event.target.value;

        // Check if the activity is already selected or not meaning removing or adding activity
        const isSelected = selectedActivities.includes(activityId);

        if (isSelected) {
            // Remove activity
            setSelectedActivities(prev => prev.filter(id => id !== activityId));
            setSelectedDurationTotal(prev => prev - (activity.duration || 0));
        } else {
            // Add activity
            setSelectedActivities(prev => [...prev, activityId]);
            setSelectedDurationTotal(prev => prev + (activity.duration || 0));
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        
        if(selectedActivities.length > 0) {
            onSubmitActivities(selectedActivities, user_id, playlist_id, selectedDurationTotal);
        } else {
            onClose()
        }
    }

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

    // remove existed activities in the playlist
    const availableActivities = useMemo(() => {
        if (activityList.length === 0) {
            return [];
        }; 

        const newList = activityList.filter(activity => 
            !current_activity_ids.includes(activity.activity_id)
        );    

        return newList
            
    }, [activityList, current_activity_ids])
    

    const filteredActivities = getFilteredActivities(availableActivities, selectedDurations, selectedAgeGroups, selectedTags);

    const sortedActivities = getSortedActivities( sortOption, filteredActivities );



    let content;
    if (Object.keys(sortedActivities).length === 0) {
        content = <p>You haven't liked activities yet.</p>
    } else {
        content = sortedActivities.map((activity) => (
            <label key={activity.activity_id} className={classes.checkContainer}>
                <input
                    type="checkbox"
                    name="activityCheck"
                    value={activity.activity_id}
                    onChange={(e) => handleSelectionChange(e, activity)}
                    className={classes.customCheck}
                />
                <div className={classes.activityItemComponent}>
                    <UserActivityList 
                        activity={activity} 
                    />
                </div>
            </label>
        ))       
    }

    return (
        <div className={classes.selectionContents}>
            <div className={classes.doneButtonComponent}>
                <TopButton onClick={onBackToSelection} >Back</TopButton>
                <TopButton onClick={handleSubmit} colorScheme="primary">Done</TopButton>
            </div>
            <h3>Add to Playlist : {title}</h3>
            {selectedList === 'like' ? 
                <h4>My Likes ({activityList.length} items)</h4> : 
                <h4>My Uploads ({activityList.length} items)</h4>
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
            <h4 className={classes.itemCounts}>{sortedActivities.length} items available</h4>
            <form>
                <div>
                {content}
                </div>
                <div className={classes.bottomButtonComponent}>
                    <ButtonS onClick={handleSubmit} colorScheme="primary">Done</ButtonS>
                </div>
            </form>
        </div>
    )
}

export default SelectionForm;
