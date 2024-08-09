import classes from '../css/UI/File.module.css'

function File({children}){
    return (
        <div className={classes.file}>{children}</div>
    )
}

export default File;