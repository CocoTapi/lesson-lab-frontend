import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import classes from './ErrorPage.module.css';
import ButtonM from "../../components/UI/ButtonM";

function ErrorPage(){
    let error = useRouteError();
    let message = 'Something went wrong!';
    let secondMessage = ''
    let status;

    if (isRouteErrorResponse(error)) {
        if(error.message) console.log("error message:", error.message);
        if(error.status) console.log("error status:", error.status);

        if (error.status === 404) {
          message = 'Sorry, Page Not Found'
        }
    
        if (error.status === 401) {
          message = "You aren't authorized to see this."
        }
    
        if (error.status === 503) {
          message = "Looks like server is down."
        }
      }
    
    return ( 
        <div className={classes.errorComponent}>
          <div className={classes.errorContents}>
            <h1>{message}</h1>
              <div className={classes.imageComponent}>
                  <img src='/images/errorImg.png' alt="example" />
              </div>
          </div>
          <Link to='/' className={classes.buttonComponent}>
              <ButtonM>Back to Home</ButtonM>
            </Link>
      </div>
    )
}

export default ErrorPage;