import classes from '../css/UI/SortBar.module.css'
import { colorSchemes } from './colorSchemes';

const barLength = {
    long: {
        width: '999px'
    },
    short: {
        width: '315px'
    }
};

function SortBar ({ colorScheme = 'primary', size = 'long', onSortChange }) {
    const { textColor, backgroundColor, borderColor } = colorSchemes[colorScheme] || colorSchemes.primary;
    const { width } = barLength[size] || barLength.long;
    
    const barStyle = {
        color: textColor,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        width: width
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

