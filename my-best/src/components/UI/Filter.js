import classes from '../css/UI/Filter.module.css';
import ButtonS from './ButtonS';


function Filter({ onTimeChange, onAgeChange }) {
 

    const handleTimeChange = (event) => {
        onTimeChange(event.target.value);
    };

    const handleAgeChange = (event) => {
        onAgeChange(event.target.value);
    };

    return (
        <div className={classes.box}>
            <form>
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
                    <label><input type="radio" value="kids" onChange={handleAgeChange}/> For kids</label>
                    <label><input type="radio" value="teens" onChange={handleAgeChange}/> For teens</label>
                    <label><input type="radio" value="adults" onChange={handleAgeChange}/> For adults</label>
                    <label><input type="radio"value="all age" onChange={handleAgeChange}/> For all ages</label>
                </div>
                <div className={classes.view}>
                    <button className={classes.clear}>clear all</button>
                    <ButtonS>view</ButtonS>
                </div>
            </form>
        </div>
    )
}

export default Filter;