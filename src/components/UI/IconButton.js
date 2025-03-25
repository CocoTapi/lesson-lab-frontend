import classes from '../css/UI/IconButton.module.css';

function IconButton({ className, children, ...rest }){   
    
    
    return (
        <div>
            <button
                className={`${classes.button} ${className}`}
                {...rest}
            >
                {children}
            </button>
        </div>
    )
}

export default IconButton;