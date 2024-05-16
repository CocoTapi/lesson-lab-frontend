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

    return (
        <div className={classes.box}>
            <form>
                <div className={classes.contents}>
                    <h1>Filter</h1>

                    <h2>Duration</h2>
                    <div className={classes.radio}>
                        <label><input type="radio" value="~5 mins" onChange={handleTimeChange} /> ~ 5 mins</label>
                        <label><input type="radio" value="10 mins" onChange={handleTimeChange} /> 10 mins</label>
                        <label><input type="radio" value="15 mins" onChange={handleTimeChange} /> 15 mins</label>
                        <label><input type="radio" value="20 mins" onChange={handleTimeChange} /> 20 mins</label>
                        <label><input type="radio" value="25 mins" onChange={handleTimeChange} /> 25 mins</label>
                        <label><input type="radio" value="30 ~ mins" onChange={handleTimeChange} /> 30 ~ mins</label>   
                    </div>    

                    <h2>Age Group</h2>
                    <div className={classes.radio}>
                        <label><input type="radio" value="kids" onChange={handleAgeChange}/> for kids</label>
                        <label><input type="radio" value="teens" onChange={handleAgeChange}/> for teens</label>
                        <label><input type="radio" value="adults" onChange={handleAgeChange}/> for adults</label>
                        <label><input type="radio"value="all age" onChange={handleAgeChange}/> for all ages</label>
                    </div>

                    <h2>Popular Categories</h2>
                    <div className={classes.radio}>
                        <label><input type="radio" value="icebreakers" onChange={handleTagChange}/> icebreakers</label>
                        <label><input type="radio" value="fun" onChange={handleTagChange}/> fun</label>
                        <label><input type="radio" value="interactive" onChange={handleTagChange}/> interactive</label>
                        <label><input type="radio"value="minimum prep" onChange={handleTagChange}/> min prep</label>
                    </div>

                    <div className={classes.viewButtons}>
                        <button className={classes.clearButton}>clear all</button>
                        <ButtonS>view</ButtonS>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Filter;