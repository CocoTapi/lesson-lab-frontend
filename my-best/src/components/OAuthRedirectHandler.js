//import React, { useEffect } from 'react';
//import { useLocation, useHistory } from 'react-router-dom';
import { handleGoogleAuthEvent } from '../pages/util/checkAuth';

function OAuthRedirectHandler(){
    handleGoogleAuthEvent()
    // access information about the current URL
    //const location = useLocation();
    // navigate to different routes
    // const history = useHistory();

    // useEffect(() => {
    //     // Check if the current location contains authentication data from Google OAuth
    //     // For example, if Google redirects back to your application with a token or code
    //     // You would extract that data from the location object and perform authentication checks

    //     // Example: Check if location contains a token
    //     const token = new URLSearchParams(location.search).get('token');
    //     if (token) {
    //         // Perform authentication checks (e.g., validate token with your backend)
    //         // If authentication is successful, redirect to the home page
    //         history.push('/');
    //     } else {
    //         console.error('Authentication token not found.');
    //         // Handle error or redirect to an error page
    //         history.push('/auth');
    //     }
    // }, [location, history]);

    return (
        <div>
            <p>Processing Google OAuth redirection...</p>
        </div>
    );
};

export default OAuthRedirectHandler;