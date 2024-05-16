import { useState, useEffect } from 'react';
import classes from '../css/activities/ActivityList.module.css';
import Filter from '../UI/Filter';
import SummaryCard from './SummaryCard';
import SortBar from '../UI/SortBar';
import Tag from '../UI/Tag';
import { MdOutlineFilterCenterFocus } from "react-icons/md";


function ActivityList({ activities }){
    const [ sortOption, setSortOption ] = useState('shortToLong'); 
    const [ searchTerm, setSearchterm ] = useState('');
    const [ showFilterButton, setShowFilterButton] = useState(false);

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

   
    return (
        <div className={classes.main}>
            <div className={classes.contents}>
                <div className={classes.sortBar}>
                    <SortBar onSortChange={setSortOption} onSearchTermChange={setSearchterm} search='true' />
                    { showFilterButton && 
                        <div className={classes.filterButtons}>
                            <div className={classes.fButton}>
                                <Tag hash='false'>
                                    <MdOutlineFilterCenterFocus className={classes.fIcon} />
                                    Duration
                                </Tag>
                            </div>
                            <div className={classes.fButton}>
                                <Tag hash='false'>
                                    <MdOutlineFilterCenterFocus className={classes.fIcon} />
                                    Age Group
                                </Tag>
                            </div>
                            <div className={classes.fButton}>
                                <Tag hash={false} >
                                    <MdOutlineFilterCenterFocus className={classes.fIcon} />
                                    Popular Categories
                                </Tag>
                            </div>
                        </div>
                    }
                </div>
                <div className={classes.frame}>
                    { !showFilterButton && 
                        <div className={classes.filter}>
                            <Filter />
                        </div>
                    }
                    <ul className={classes.list}>
                        {activities.map((activity) => (
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