import classes from '../css/UI/ButtonM.module.css';
import { colorSchemes } from './colorSchemes';

function ButtonM({ className, children, colorScheme = 'primaryBorder', ...rest }){
    const { textColor, backgroundColor, borderColor } = colorSchemes[colorScheme] || colorSchemes.primaryBorder;
    
    const buttonStyle = {
        color: textColor,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
    };
    
    return (
        <div>
            <button
                className={`${classes.button} ${className}`}
                style={buttonStyle}
                {...rest}
            >
                {children}
            </button>
        </div>
    )
}

export default ButtonM;