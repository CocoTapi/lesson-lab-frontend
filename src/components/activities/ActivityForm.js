import { Link } from "react-router-dom";
import ButtonM from "../UI/ButtonM";
import classes from '../css/activities/ActivityForm.module.css';


export default function NewActivity() {
    return (
        <div className={classes.comContainer}>
            <h1>Coming Soon!</h1>
            <p>I'm working hard to bring this page to life. Stay tuned for updates!</p>
            <Link to='/' className={classes.buttonComponent}>
                <ButtonM colorScheme="primary">Back to Home</ButtonM>
            </Link>
        </div>

    )
}
