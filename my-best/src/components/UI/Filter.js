import classes from '../css/UI/Filter.module.css';
import ButtonS from './ButtonS';


function Filter({ onTimeChange, onAgeChange, onTagChange }) {
 

    const handleTimeChange = (event) => {
        onTimeChange(event.target.value);
    };

    const handleAgeChange = (event) => {
        onAgeChange(event.target.value);
    };

    const handleTagChange = (event) => {
        onTagChange(event.target.value);
    }

    const handleViewButton = (event) => {
        event.preventDefault();
    }

    const handleClearButton = (event) => {
        event.preventDefault();
        onTimeChange('');
        onAgeChange('');
        onTagChange('');
    }

    return (
        <div className={classes.box}>
            <form>
                <div className={classes.contents}>
                    <h1>Filter</h1>

                    <h2>Duration</h2>
                    <div className={classes.radio}>
                        <label><input type="radio" name="duration" value="5" onChange={handleTimeChange} /> ~ 5 mins</label>
                        <label><input type="radio" name="duration" value="10" onChange={handleTimeChange} /> 10 mins</label>
                        <label><input type="radio" name="duration" value="15" onChange={handleTimeChange} /> 15 mins</label>
                        <label><input type="radio" name="duration" value="20" onChange={handleTimeChange} /> 20 mins</label>
                        <label><input type="radio" name="duration" value="25" onChange={handleTimeChange} /> 25 mins</label>
                        <label><input type="radio" name="duration" value="30" onChange={handleTimeChange} /> 30 ~ mins</label>   
                    </div>    

                    <h2>Age Group</h2>
                    <div className={classes.radio}>
                        <label><input type="radio" name="ageGroup" value="kids" onChange={handleAgeChange}/> for kids</label>
                        <label><input type="radio" name="ageGroup" value="teens" onChange={handleAgeChange}/> for teens</label>
                        <label><input type="radio" name="ageGroup" value="adults" onChange={handleAgeChange}/> for adults</label>
                        <label><input type="radio" name="ageGroup" value="all age" onChange={handleAgeChange}/> for all ages</label>
                    </div>

                    <h2>Popular Categories</h2>
                    <div className={classes.radio}>
                        <label><input type="radio" name="category" value="icebreaker" onChange={handleTagChange}/> icebreakers</label>
                        <label><input type="radio" name="category" value="fun" onChange={handleTagChange}/> fun</label>
                        <label><input type="radio" name="category" value="interactive" onChange={handleTagChange}/> interactive</label>
                        <label><input type="radio" name="category" value="minimum prep" onChange={handleTagChange}/> min prep</label>
                    </div>

                    <div className={classes.viewButtons}>
                        <button className={classes.clearButton} onClick={handleClearButton}>clear all</button>
                        <ButtonS onClick={handleViewButton} >view</ButtonS>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Filter;