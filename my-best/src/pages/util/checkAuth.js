import { redirect } from 'react-router-dom'
import { API_URL } from '../../App';

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

export async function loader () {
    const token = getAuthToken();
    if(token){
        const { user_id, user_name } = await getUserInfoFromToken(token);
        return { token: token, user_id: user_id, user_name: user_name};
    } else {
        return token
    }

};

export function checkAuthLoader() {
    const token = getAuthToken();

    if (!token) {
        return redirect("./auth?mode=login")
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

export async function getUserInfoFromToken(token){
    const response = await fetch(`${API_URL}/user`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if(!response.ok) {
        throw Error('Could not fetch user info.')
    }

    const resData = await response.json();
    //console.log("resData:", resData);

    const user_id = resData.data.user_id;
    const user_name = resData.data.user_name;
   
    return { user_id, user_name };
}