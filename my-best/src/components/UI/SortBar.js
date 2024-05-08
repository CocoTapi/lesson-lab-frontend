import classes from '../css/UI/SortBar.module.css'
import { colorSchemes } from './colorSchemes';
import ButtonM from './ButtonM';

function SortBar (
    { 
    colorScheme = 'primary', 
    onSortChange, 
    search = 'false', 
    onSearchTermChange,
    button,
    icon, 
    buttonWord,
    onClick,
    buttonColor
}) {
    const { textColor, backgroundColor, borderColor } = colorSchemes[colorScheme] || colorSchemes.primary;
    
    const barStyle = {
        color: textColor,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
    };

    const sortChangeHandler = (event) => {
        if(onSortChange) {
            onSortChange(event.target.value);
        }
    }

    const handleSearchTermChange = (e) => {
        if(onSearchTermChange)
        onSearchTermChange(e.target.value);
    }

    return (
        <div 
            className={classes.bar}
            style={barStyle}
        >
            <h1>Sort by</h1>
            <form>
                <select id='sort' type='sort' name='sort' onChange={sortChangeHandler} className={classes.formSelect}>
                    <option value="shortToLong">Duration: Short to Long</option>
                    <option value="longToShort">Duration: Long to Short</option>
                    <option value="TopRated">User's Top Rated</option>
                    <option value="New">New Arrivals</option>
                </select> 
            </form>
            {search === 'true' && 
                <form className={classes.right}>
                    <input className={classes.inputFrame} onChange={handleSearchTermChange} placeholder="Search"/>
                </form>
            }
            {button === 'ButtonM' &&
            <div className={classes.right}>
                 <ButtonM colorScheme={buttonColor} onClick={onClick} >
                    <h2 className={classes.buttonIcon}>{icon}</h2>
                    <p>{buttonWord}</p>
                </ButtonM>
            </div>
            }
        </div>
    )
}

export default SortBar;

