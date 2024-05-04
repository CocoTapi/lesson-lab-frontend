import classes from '../css/UI/SortBar.module.css'
import { colorSchemes } from './colorSchemes';

function SortBar ({ colorScheme = 'primary', onSortChange }) {
    const { textColor, backgroundColor, borderColor } = colorSchemes[colorScheme] || colorSchemes.primary;
    
    const barStyle = {
        color: textColor,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
    };

    const changeHandler = (event) => {
        if(onSortChange) {
            onSortChange(event.target.value);
        }
    }

    return (
        <div 
            className={classes.bar}
            style={barStyle}
        >
            <h1>Sort by</h1>
            <form>
                <select id='sort' type='sort' name='sort' onChange={changeHandler} className={classes.formSelect}>
                    <option value="shortToLong">Duration: Short to Long</option>
                    <option value="longToShort">Duration: Long to Short</option>
                    <option value="TopRated">User's Top Rated</option>
                    <option value="New">New Arrivals</option>
                </select> 
            </form>
        </div>
    )
}

export default SortBar;

