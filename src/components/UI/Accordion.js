import { useState } from "react";
import classes from '../css/UI/Accordion.module.css';
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const colors = {
    white: {
        backgroundColor: 'white'
    },
    grey: {
        backgroundColor: 'var(--color-grey-300)'
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
    expandable = true
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
                <div className={classes.headerPicAndContents}>
                    <div className={classes.topImage}>
                        {topImage}
                    </div>
                    <div className={classes.headerItem}>
                        <h2>{headerTitle}</h2>
                        <div>
                            {headerContents}
                        </div> 
                    </div>    
                </div> 
                {expandable && 
                    <div className={classes.headerRight} onClick={handleClick}>
                        {expanded ? <FaChevronUp /> : <FaChevronDown /> }
                    </div>
                }            
                
            </div>
            {expanded && 
                <div className={classes.detailFrame}>
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