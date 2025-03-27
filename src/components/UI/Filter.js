import classes from '../css/UI/Filter.module.css';


function Filter({ onDurationsChange, onAgeGroupsChange, onTagsChange, selectedDurations, selectedAgeGroups, selectedTags, onShowFilterMenu }) {
 

    const handleDurationChange = (event) => {
        const { value } = event.target;
        onDurationsChange(prevState =>
            prevState.includes(value)
                ? prevState.filter(duration => duration !== value)
                : [...prevState, value]
        );
    };

    const handleAgeChange = (event) => {
        const { value } = event.target;
        onAgeGroupsChange(prevState =>
            prevState.includes(value)
                ? prevState.filter(ageGroup => ageGroup !== value)
                : [...prevState, value]
        );
    };

    const handleTagChange = (event) => {
        const { value } = event.target;
        onTagsChange(prevState =>
            prevState.includes(value)
                ? prevState.filter(tag => tag !== value)
                : [...prevState, value]
        );
    };

    // const handleViewButton = (event) => {
    //     event.preventDefault();
    //     onShowFilterMenu(false);
    // }

    const handleClearButton = (event) => {
        event.preventDefault();
        onDurationsChange([]);
        onAgeGroupsChange([]);
        onTagsChange([]);
    };

    return (
        <div className={classes.box}>
            <form>
                <div className={classes.contents}>
                    <h1>Filter</h1>

                    <h2>Duration</h2>
                    <div className={classes.checkbox}>
                        <label><input type="checkbox" name="duration" value="5"  checked={selectedDurations.includes("5")} onChange={handleDurationChange} /> ~ 5 mins</label>
                        <label><input type="checkbox" name="duration" value="10" checked={selectedDurations.includes("10")} onChange={handleDurationChange} /> 10 mins</label>
                        <label><input type="checkbox" name="duration" value="15" checked={selectedDurations.includes("15")} onChange={handleDurationChange} /> 15 mins</label>
                        <label><input type="checkbox" name="duration" value="20" checked={selectedDurations.includes("20")} onChange={handleDurationChange} /> 20 mins</label>
                        <label><input type="checkbox" name="duration" value="25" checked={selectedDurations.includes("25")} onChange={handleDurationChange} /> 25 mins</label>
                        <label><input type="checkbox" name="duration" value="31" checked={selectedDurations.includes("31")} onChange={handleDurationChange} /> 30 ~ mins</label>   
                    </div>    

                    <h2>Age Group</h2>
                    <div className={classes.checkbox}>
                        <label><input type="checkbox" name="ageGroup" value="kids" checked={selectedAgeGroups.includes("kids")} onChange={handleAgeChange}/> for kids</label>
                        <label><input type="checkbox" name="ageGroup" value="teens" checked={selectedAgeGroups.includes("teens")} onChange={handleAgeChange}/> for teens</label>
                        <label><input type="checkbox" name="ageGroup" value="adults" checked={selectedAgeGroups.includes("adults")} onChange={handleAgeChange}/> for adults</label>
                        <label><input type="checkbox" name="ageGroup" value="all age" checked={selectedAgeGroups.includes("all age")} onChange={handleAgeChange}/> for all ages</label>
                    </div>

                    <h2>Popular Categories</h2>
                    <div className={classes.checkbox}>
                        <label><input type="checkbox" name="tag" value="icebreaker" checked={selectedTags.includes("icebreaker")} onChange={handleTagChange}/> icebreakers</label>
                        <label><input type="checkbox" name="tag" value="fun" checked={selectedTags.includes("fun")} onChange={handleTagChange}/> fun</label>
                        <label><input type="checkbox" name="tag" value="interactive" checked={selectedTags.includes("interactive")} onChange={handleTagChange}/> interactive</label>
                        <label><input type="checkbox" name="tag" value="minimum prep" checked={selectedTags.includes("minimum prep")} onChange={handleTagChange}/> min prep</label>
                    </div>

                    <div className={classes.viewButtons}>
                        <button className={classes.clearButton} onClick={handleClearButton}>clear all</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Filter;

export function getFilteredActivities(activities, selectedDurations, selectedAgeGroups, selectedTags){
    const filteredActivities = activities.filter(activity => {
        const matchesDuration = selectedDurations.length === 0 || selectedDurations.includes(activity.duration.toString());
        const matchesAgeGroup = selectedAgeGroups.length === 0 || selectedAgeGroups.some(age_group => activity.age_group.split(' and ').includes(age_group));
        const matchesTag = selectedTags.length === 0 || selectedTags.some(tag => activity.tags.includes(tag));

        return matchesDuration && matchesAgeGroup && matchesTag;
    });

    return filteredActivities;
}