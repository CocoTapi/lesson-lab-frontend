import { useState } from 'react';
import { Link } from 'react-router-dom';
import SmallCard from '../UI/SmallCard';
import { GoHeart, GoBookmark } from "react-icons/go";
import classes from '../css/activities/ActivityList.module.css';
import SortBar from '../UI/SortBar';
import Filter from '../UI/Filter';

function ActivityList({ activities }){
    const [sortOption, setSortOption] = useState('shortToLong'); 

    //TODO: handle sortOption
   
    return (
        <div className={classes.frame}>
            <h1>All Activities</h1>
            <div>
                <Filter />
            </div>
            <div className={classes.right}>
                <div>
                    <SortBar onSortChange={setSortOption} />
                    <ul className={classes.list}>
                        {activities.map((activity) => (
                            <li key={activity.activity_id}>
                                <SmallCard>
                                    <div className={classes.card}>
                                        <Link to={`/activities/${activity.activity_id}`}>
                                            <div className={classes.duration}>Duration: {activity.duration} min</div>
                                            <img src='/images/1.png' alt="example" />
                                            <h2>{activity.title}</h2>
                                            <div className={classes.icons}>
                                                <GoHeart />
                                                <GoBookmark />
                                            </div>
                                            <p>{activity.like_count} likes</p>
                                            <p>{activity.summary}</p>
                                            <p>Age group: {activity.age_group}</p>
                                        </Link>
                                    </div>
                                </SmallCard>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
           
        </div>
    )
};

export default ActivityList;