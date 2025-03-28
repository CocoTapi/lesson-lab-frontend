import { useState, useEffect } from 'react';
import classes from '../css/activities/ActivityList.module.css';
import Filter, { getFilteredActivities } from '../UI/Filter';
import SummaryCard from './SummaryCard';
import SortBar, { getSortedActivities } from '../UI/SortBar';
import Tag from '../UI/Tag';
import { MdOutlineFilterCenterFocus } from "react-icons/md";
import { FaChevronDown } from "react-icons/fa";
import { useNavigate, useSubmit } from 'react-router-dom';
import { IoIosCloseCircleOutline } from "react-icons/io";
import ButtonM from '../UI/ButtonM';



function ActivityList({ activities }){
    const [ sortOption, setSortOption ] = useState(''); 
    const [ selectedDurations, setSelectedDurations ] = useState([]);
    const [ selectedAgeGroups, setSelectedAgeGroups ] = useState([]);
    const [ selectedTags, setSelectedTags ] = useState([]);
    const submit = useSubmit();
    const navigate = useNavigate();

    const [displayFilterButton, setDisplayFilterButton] = useState(true);

    const [openFilter, setOpenFilter] = useState(false);
    
    //handle screen sizes change
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1300) {
                setDisplayFilterButton(true);
            } else {
                setDisplayFilterButton(false);
            }
        };

        // Initial check on mount
        handleResize();

        // Listen for resize events
        window.addEventListener("resize", handleResize);

        // Clean up
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleFilterButton = () => {
        setOpenFilter(!openFilter);
    }


    //filter functions
    const handleDurationChange = (duration) => {
       setSelectedDurations(duration);
    }

    const handleAgeGroupChange = (ageGroup) => {
        setSelectedAgeGroups(ageGroup);
    };

    const handleTagChange = (tag) => {
        setSelectedTags(tag);
    }

    // TODO: search term reset

   //handle search term 
    const handleSearchTermSubmit = (searchTerm) => {
        if(!searchTerm || searchTerm.length <= 0) {
           searchTerm = "";
        }
        submit({ searchTerm }, { method: "POST" });
    }
    
    //handle return to all activities
    const handleReturnToAllActivities = () => {
        // From Filter    
        setSelectedDurations([]);
        setSelectedAgeGroups([]);
        setSelectedTags([]);

        // From Search 
        navigate('../activities');
    }

    const filteredActivities = getFilteredActivities(activities, selectedDurations, selectedAgeGroups, selectedTags);

    const sortedActivities = getSortedActivities( sortOption, filteredActivities );

    let countTitle = 'All';
    if(
        selectedDurations.length > 0 || 
        selectedAgeGroups.length > 0 ||
        selectedTags.length > 0
    ) {
        countTitle = 'Filtered'
    }
   
    return (
        <div className={classes.main}>
            <div className={classes.contents}>
                <div className={classes.sortBar}>
                    <SortBar 
                        onSortChange={setSortOption} 
                        onSearchTermSubmit={handleSearchTermSubmit} 
                        search='true' 
                    />

                    {/* Show Filter Button for Small Screens */}
                    {displayFilterButton &&
                        <div
                            className={classes.filterButtons}
                            onClick={handleFilterButton}
                        >
                            <div className={classes.fButton}>
                                <Tag hash="false">
                                    <MdOutlineFilterCenterFocus
                                        className={classes.fIcon}
                                    />
                                    <p>Filter</p>
                                    {openFilter ? (
                                        <IoIosCloseCircleOutline
                                            className={classes.closeIcon}
                                        />
                                    ) : (
                                        <FaChevronDown className={classes.fIcon} />
                                    )}
                                </Tag>
                            </div>
                        </div>
                    }

                    {displayFilterButton && openFilter && 
                    <div className={classes.filter}>
                        <Filter
                            onDurationsChange={handleDurationChange}
                            onAgeGroupsChange={handleAgeGroupChange}
                            onTagsChange={handleTagChange}
                            selectedDurations={selectedDurations}
                            selectedAgeGroups={selectedAgeGroups}
                            selectedTags={selectedTags}
                        />
                    </div>
                    }

                    <h2 className={classes.itemCounts}>{countTitle} Activities : {sortedActivities.length} items</h2>

                </div>
                <div className={classes.frame}>
                     {/* Filter inside .frame only when width >= 3000px */}
                     {!displayFilterButton && (
                        <div className={classes.filter}>
                            <Filter
                                onDurationsChange={handleDurationChange}
                                onAgeGroupsChange={handleAgeGroupChange}
                                onTagsChange={handleTagChange}
                                selectedDurations={selectedDurations}
                                selectedAgeGroups={selectedAgeGroups}
                                selectedTags={selectedTags}
                            />
                        </div>
                    )}

                    {/* activity list */}
                    <ul className={classes.list}>
                        {sortedActivities.length === 0 &&
                            <div>
                                <h2>No results found. Please try a different search term.</h2>
                                <ButtonM onClick={handleReturnToAllActivities}>Show all activities</ButtonM>
                            </div>
                        }
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