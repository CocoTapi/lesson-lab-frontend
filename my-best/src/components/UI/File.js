import classes from '../css/user_page/File.module.css'

function File({children}){
    return (
        <div className={classes.file}>{children}</div>
    )
}

export default File;