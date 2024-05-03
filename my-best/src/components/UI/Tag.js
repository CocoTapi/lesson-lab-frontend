import classes from '../css/UI/Tag.module.css';
import { colorSchemes } from './colorSchemes';
import { FaHashtag } from "react-icons/fa6";


function Tag({ className, children, colorScheme = 'primaryBorder', ...rest }){
    const { textColor, backgroundColor, borderColor } = colorSchemes[colorScheme] || colorSchemes.primaryBorder;
    
    const buttonStyle = {
        color: textColor,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
    };
    
    return (
        <button
            className={`${classes.button} ${className}`}
            style={buttonStyle}
            {...rest}
        >
                <p><FaHashtag /></p>
            {children}
        </button>
    )
}

export default Tag;