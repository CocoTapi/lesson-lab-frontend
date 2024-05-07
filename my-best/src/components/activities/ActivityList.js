import { useState } from 'react';
import classes from '../css/activities/ActivityList.module.css';
import Filter from '../UI/Filter';
import SummaryCard from './SummaryCard';
import SortBar from '../UI/SortBar';


function ActivityList({ activities }){
    const [ sortOption, setSortOption ] = useState('shortToLong'); 
    const [ searchTerm, setSearchterm ] = useState('');

    //TODO: handle sortOption

   
    return (
        <div className={classes.main}>
            <div className={classes.sortBar}>
                <SortBar onSortChange={setSortOption} onSearchTermChange={setSearchterm} search='true' />
            </div>
            <div className={classes.frame}>
                <div className={classes.filter}>
                    <Filter />
                </div>
                <div className={classes.right}>
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