import { useState } from "react";
import { GoHeart, GoHeartFill, GoBookmark, GoBookmarkFill } from "react-icons/go";
import classes from '../css/UI/Accordion.module.css';
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const colors = {
    white: {
        backgroundColor: 'white'
    },
    grey: {
        backgroundColor: 'var(--color-grey-100)'
    }
}

function Accordion ({ 
    headerTitle, 
    topImage, 
    headerContents, 
    // activityLeft,
    // activityRight,
    activityDetail,
    buttonChildren,
    color = 'white',
   }){
    const [expanded, setExpanded ] = useState(false);
    const { backgroundColor } = colors[color] || colors.white;

    const frameStyle = {
        backgroundColor: backgroundColor
    }

    const handleClick = () => {
        setExpanded(!expanded);
    }
    

    return (
        <div 
            className={classes.frame}
            style={frameStyle}
        >
            <div className={classes.header}>
                    <div className={classes.topImage}>
                        {topImage}
                    </div>
                    <div className={classes.headerItem}>
                        <h2>{headerTitle}</h2>
                        <div>
                            {headerContents}
                        </div> 
                    </div>                 
                <div className={classes.headerRight} onClick={handleClick}>
                    {expanded ? <FaChevronUp /> : <FaChevronDown /> }
                </div>
            </div>
            {expanded && 
                <div className={classes.detailFrame}>
                    {/* <div className={classes.detailBox}>
                        <div className={classes.detailLeft}>{activityLeft}</div>
                        <div className={classes.detailRight}>{activityRight}</div>
                    </div> */}
                    {activityDetail}
                    <div className={classes.detailButton}>
                        {buttonChildren}
                    </div>
                </div>
            }
        </div>
    )
}

export default Accordion;