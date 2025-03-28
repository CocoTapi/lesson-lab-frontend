import classes from '../css/UI/SortBar.module.css'
import { useState, useEffect } from 'react';
import { colorSchemes } from './colorSchemes';
import ButtonM from './ButtonM';
import { FaSortAmountDown } from "react-icons/fa";

function SortBar (
    { 
    colorScheme = 'primary', 
    onSortChange, 
    search = 'false', 
    onSearchTermSubmit,
    button,
    icon, 
    buttonWord,
    onClick,
    buttonColor,
    topRate = 'true',
    defaultOptionName = 'Featured Activities'
}) {
    const { textColor, backgroundColor, borderColor } = colorSchemes[colorScheme] || colorSchemes.primary;
    const [showMenuBar, setShoeMenuBar] = useState(false);
    const [displayMenu, setDisplayMenu] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
 
    // TODO: fix search submission for second time's search
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 676) {
                setShoeMenuBar(true);
            } else {
                setShoeMenuBar(false);
            }
        };

        handleResize();

        // Listen for resize events
        window.addEventListener('resize', handleResize);

        // Clean up
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleOpenMenu = () => {
        setDisplayMenu(!displayMenu); 
    }

    
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

    const handleSearchTermChange = (event) => {
       setSearchTerm(event.target.value);
    }

    const handleSearchTermSubmit = (event) => {
        event.preventDefault();
        if(onSearchTermSubmit) onSearchTermSubmit(searchTerm);
    }

    return (
        <div 
            className={classes.bar}
            style={barStyle}
        >
           {!showMenuBar && 
           <>
                <h1>Sort by</h1>
                <form>
                    <select id='sort' type='sort' name='sort' onChange={sortChangeHandler} className={classes.formSelect}>
                        <option value="default">{defaultOptionName}</option>
                        <option value="shortToLong">Duration: Short to Long</option>
                        <option value="longToShort">Duration: Long to Short</option>
                        <option value="TopRated">User's Top Rated</option>
                        <option value="New">New Arrivals</option>
                    </select> 
                </form>
                {search === 'true' && 
                    <form className={classes.right} onSubmit={handleSearchTermSubmit}>
                        <input 
                            className={classes.inputFrame} 
                            onChange={handleSearchTermChange} 
                            value={searchTerm} 
                            placeholder="Search"/>
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
            </>
            }
            {showMenuBar && 
                <>
                    <div onClick={handleOpenMenu} className={classes.sortIcon}><FaSortAmountDown /></div>
                </>
            }
            {displayMenu && 
                <form>
                    <select id='sort' type='sort' name='sort' onChange={sortChangeHandler} className={classes.formSelect}>
                        <option value="default">{defaultOptionName}</option>
                        <option value="shortToLong">Duration: Short to Long</option>
                        <option value="longToShort">Duration: Long to Short</option>
                        {topRate === 'true' && <option value="TopRated">User's Top Rated</option>}
                        <option value="New">New Arrivals</option>
                    </select> 
                </form>
            }
        </div>
    )
}

export default SortBar;

export function getSortedActivities( sortOption, activities ){
    const sortedActivities = activities.sort((a, b) => {
        if (sortOption === 'shortToLong') {
            return a.duration - b.duration;
        } else if (sortOption === 'longToShort') {
            return b.duration - a.duration;
        } else if (sortOption === 'TopRated') {
            return b.like_count - a.like_count;
        } else if (sortOption === 'New') {
            return b.activity_id - a.activity_id;
        }

        return 0; // Default case if no sort option is matched
    });

    return sortedActivities;
}