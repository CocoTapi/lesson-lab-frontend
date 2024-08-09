import classes from '../css/UI/SmallCard.module.css'

function SmallCard (props) {
    return (
        <div className={classes.card}>
            <div className={classes.contents}>
                {props.children}
            </div>
        </div>
    )
}

export default SmallCard;