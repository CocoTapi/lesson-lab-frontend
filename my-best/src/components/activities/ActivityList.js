import { useState, useEffect } from 'react';
import classes from '../css/activities/ActivityList.module.css';
import Filter from '../UI/Filter';
import SummaryCard from './SummaryCard';
import SortBar from '../UI/SortBar';
import Tag from '../UI/Tag';
import { MdOutlineFilterCenterFocus } from "react-icons/md";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";



function ActivityList({ activities }){
    const [ sortOption, setSortOption ] = useState(''); 
    const [ searchTerm, setSearchterm ] = useState('');
    const [ showFilterButton, setShowFilterButton] = useState(false);
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedAgeGroup, setSelectedAgeGroup ] = useState('');
    const [selectedTag, setSelectedTag ] = useState('');
    const [ showFilterMenu, setShowFilterMenu ] = useState(false);

    //TODO: handle sortOption

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

    const filteredActivities = activities.filter((activity) => {
        const timeMatch = selectedTime ? activity.duration === parseInt(selectedTime): true;
        const ageGroupMatch = selectedAgeGroup ? activity.age_group === selectedAgeGroup : true;
        const tagMatch = selectedTag ? activity.tags.includes(selectedTag) : true;
        return timeMatch && ageGroupMatch && tagMatch;
    });

    const sortedActivities = filteredActivities.sort((a, b) => {
        if (sortOption === 'shortToLong') {
            return a.duration - b.duration;
        } else if (sortOption === 'longToShort') {
            return b.duration - a.duration;
        } else if (sortOption === 'TopRated') {
            return b.like_count - a.like_count;
        } else if (sortOption === 'New') {
            return b.activity_id - a.activity_id;
        }

        return 0; // Default case if no sort option is matched
    });

   
    return (
        <div className={classes.main}>
            <div className={classes.contents}>
                <div className={classes.sortBar}>
                    <SortBar onSortChange={setSortOption} onSearchTermChange={setSearchterm} search='true' />
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