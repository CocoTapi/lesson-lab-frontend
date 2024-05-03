import classes from '../css/UI/Tag.module.css';
import { colorSchemes } from './colorSchemes';
import { FaHashtag } from "react-icons/fa6";

const tagBorders = {
    thin: {
        borderSize: '1px solid',
    },
    thick: {
        borderSize: '2px solid'
    }
}


function Tag({ className, children, colorScheme = 'primaryBorder', border = 'thin', ...rest }){
    const { textColor, backgroundColor, borderColor } = colorSchemes[colorScheme] || colorSchemes.primaryBorder;
    const { borderSize } = tagBorders[border] || tagBorders.thin;

    const buttonStyle = {
        color: textColor,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        border: borderSize,
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