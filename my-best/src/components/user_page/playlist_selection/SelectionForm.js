import { useState, useEffect } from "react";
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
import UserActivityList from "../UserActivityList";
import TopButton from "../../UI/TopButton";

//TODO: fetch only activities that is not in the playlist

function SelectionForm({ selectedList, playlist_id, user_id, onSubmitActivities, title, onClose, onBacktoSelection, current_activity_ids }){
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

    // remove existed activities in the playlist
    const availableActivities = activityList.filter(activity => !current_activity_ids.includes(activity.activity_id));

    const filteredActivities = getFilteredActivities(availableActivities, selectedTime, selectedAgeGroup, selectedTag);

    const sortedActivities = getSortedActivities( sortOption, filteredActivities );



    let content;
    if (Object.keys(sortedActivities).length === 0) {
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
                <TopButton onClick={onBacktoSelection} >Back</TopButton>
                <TopButton onClick={handleSubmit}>Done</TopButton>
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
                    <Filter onTimeChange={handleTimeChange} onAgeChange={handleAgeGroupChange} onTagChange={handleTagChange}/>
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
