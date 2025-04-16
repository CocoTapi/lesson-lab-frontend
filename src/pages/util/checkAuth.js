import { json } from 'react-router-dom'
import { API_URL, baseName } from '../../App';
import { baseUrl } from '../../App';

//TODO token stores in local storage or cookies?

export function testTokenDuration() {
    const storedExpirationDate = localStorage.getItem('expiration');
    const expirationDate = new Date(storedExpirationDate);
    const now = new Date();
    const duration = expirationDate.getTime() - now.getTime();

    if (duration <= 0) {
        throw new Error('Token is expired')
    };
};

export function getAuthToken() {
    const token = localStorage.getItem('token');

    try {
        if (!token) throw new Error("Token does not exist in local storage")
        testTokenDuration();
    } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');

        return null;
    }

    return token;
};

export async function userLoader({ request, params }) {
    const urlParams = new URLSearchParams(new URL(request.url).search)
    let token = urlParams?.get('token');

    if (token) {
        localStorage.setItem('token', token);
        const expiration = new Date();
        expiration.setHours(expiration.getHours() + 1);
        localStorage.setItem('expiration', expiration.toISOString());
  
        if(isMobileDevice()){
            window.postMessage({ token }, '*'); 
        } else {
            window.opener.postMessage({ token }, '*'); 
            window.close();
        }
    }

    token = getAuthToken();

    if (!token) {
        // you have to return "null" if there is anything to return.
        return null;
    }

    const { user_id, user_name } = await getUserInfoFromToken(token);
    return { token, user_id, user_name };
};

export function handleGoogleAuthEvent(event) {
    if (event.data && event.data.token) {
        // Store the token
        localStorage.setItem('token', event.data.token);

        const expiration = new Date();
        expiration.setHours(expiration.getHours() + 1);
        localStorage.setItem('expiration', expiration.toISOString());

        window.location.href = `${baseUrl}${baseName}`
    }
}


export async function getUserInfoFromToken(token) {
    const response = await fetch(`${API_URL}/user`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw json({ message: 'Could not fetch user info.' }, { status: 500 })
    }

    const resData = await response.json();

    const user_id = resData.data.user_id;
    const user_name = resData.data.user_name;

    return { user_id, user_name };
}

function isMobileDevice() {
    return /Mobi|Android/i.test(navigator.userAgent);
}