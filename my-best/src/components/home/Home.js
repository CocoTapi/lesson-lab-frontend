import classes from '../css/home/home.module.css';


function Home() {
    let message = 'Something went wrong!';
    return (
        <div className={classes.errorComponent}>
            <div className={classes.errorContents}>
                <h1>{message}</h1>
                <div className={classes.imageComponent}>
                    <img src='/images/errorImg.png' alt="example" />
                </div>
            </div>
        </div>
           
)
};

export default Home;