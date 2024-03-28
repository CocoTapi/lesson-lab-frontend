import { redirect } from 'react-router-dom'

//TODO token stores in local storage or cookies?

export function getTokenDuration() {
    const storedExpirationDate = localStorage.getItem('expiration');
    const expirationDate = new Date(storedExpirationDate);
    const now = new Date();
    const duration = expirationDate.getTime() - now.getTime();
    return duration;
};

export function getAuthToken() {
    const token = localStorage.getItem('token');

    if (!token) {
        return null;
    }

    const tokenDuration = getTokenDuration();
    if(tokenDuration < 0) {
        return 'EXPIRED'
    };

    return token;
};

export function loader () {
    return getAuthToken();
};

export function checkAuthLoader() {
    const token = getAuthToken();

    if (!token) {
        return redirect("./auth")
    }

    return null;
}


export function handleGoogleAuthEvent(event) {

    console.log("call the function!!!!!");
    if (event.data && event.data.token) {
        localStorage.setItem('token', event.data.token); // Store the token
        //perform all other logic
        /**
         * redirect to another page
         */
        console.log("redirect!!!!!!")
        window.location.href = "/";
    }
}