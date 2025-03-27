import classes from '../css/UI/Modal.module.css'
// TODO: Add cancel area
// TODO: add border-radius
function Modal({children}){
    return (
        <div className={classes.modal}>
            <div className={classes.modalCard}>
                {children}
            </div>
        </div>
    )
}

export default Modal;