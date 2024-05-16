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
    onSearchTermChange,
    button,
    icon, 
    buttonWord,
    onClick,
    buttonColor
}) {
    const { textColor, backgroundColor, borderColor } = colorSchemes[colorScheme] || colorSchemes.primary;
    const [showMenuBar, setShoeMenuBar] = useState(false);
    const [displayMenu, setDisplayMenu] = useState(false);
 
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 677) {
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

    const handleSearchTermChange = (e) => {
        if(onSearchTermChange)
        onSearchTermChange(e.target.value);
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
                        <option value="shortToLong">Duration: Short to Long</option>
                        <option value="longToShort">Duration: Long to Short</option>
                        <option value="TopRated">User's Top Rated</option>
                        <option value="New">New Arrivals</option>
                    </select> 
                </form>
            }
        </div>
    )
}

export default SortBar;

