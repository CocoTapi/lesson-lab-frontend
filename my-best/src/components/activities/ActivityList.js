import { useState, useEffect } from 'react';
import classes from '../css/activities/ActivityList.module.css';
import Filter, { getFilteredActivities } from '../UI/Filter';
import SummaryCard from './SummaryCard';
import SortBar, { getSortedActivities } from '../UI/SortBar';
import Tag from '../UI/Tag';
import { MdOutlineFilterCenterFocus } from "react-icons/md";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useSubmit } from 'react-router-dom';



function ActivityList({ activities }){
    const [ sortOption, setSortOption ] = useState(''); 
    const [ showFilterButton, setShowFilterButton ] = useState(false);
    const [ selectedTime, setSelectedTime ] = useState('');
    const [ selectedAgeGroup, setSelectedAgeGroup ] = useState('');
    const [ selectedTag, setSelectedTag ] = useState('');
    const [ showFilterMenu, setShowFilterMenu ] = useState(false);
    const submit = useSubmit();
    
    //handle screen sizes change
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 1300) {
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

    const handleFilterButton = () => {
        setShowFilterMenu(!showFilterMenu);
    }


    //filter functions
    const handleTimeChange = (time) => {
       setSelectedTime(time);
    }

    const handleAgeGroupChange = (ageGroup) => {
        setSelectedAgeGroup(ageGroup);
    };

    const handleTagChange = (tag) => {
        setSelectedTag(tag);
    }

   //handle search term 
    const handleSearchTermSubmit = (searchTerm) => {
        console.log("searchTerm:", searchTerm)
        submit({ searchTerm: searchTerm }, { method: "POST" });
    }


    const filteredActivities = getFilteredActivities(activities, selectedTime, selectedAgeGroup, selectedTag);

    const sortedActivities = getSortedActivities( sortOption, filteredActivities );

    let countTitle = 'All';
    if(
        selectedTime.length > 0 || 
        selectedAgeGroup.length > 0 ||
        selectedTag.length > 0
    ) {
        countTitle = 'Filtered'
    }
   
    return (
        <div className={classes.main}>
            <div className={classes.contents}>
                <div className={classes.sortBar}>
                    <SortBar onSortChange={setSortOption} onSearchTermSubmit={handleSearchTermSubmit} search='true' />
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
                    {showFilterMenu && <Filter onTimeChange={handleTimeChange} onAgeChange={handleAgeGroupChange} onTagChange={handleTagChange}/>}
                    <h2 className={classes.itemCounts}>{countTitle} Activities : {sortedActivities.length} items</h2>
                </div>
                <div className={classes.frame}>
                    { !showFilterButton && 
                        <div className={classes.filter}>
                            <Filter onTimeChange={handleTimeChange} onAgeChange={handleAgeGroupChange} onTagChange={handleTagChange}/>
                        </div>
                    }
                    <ul className={classes.list}>
                        {sortedActivities.map((activity) => (
                            <li key={activity.activity_id}>
                                <SummaryCard activity={activity} link={`../activities/${activity.activity_id}`}/>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
       
    )
};

export default ActivityList;