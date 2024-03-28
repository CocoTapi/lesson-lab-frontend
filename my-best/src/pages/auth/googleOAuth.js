import { API_URL } from "../../App";
import { json } from "react-router-dom";
//import OAuthRedirectPage from "./OAuthRedirectPage";
import { handleGoogleAuthEvent } from "../util/checkAuth";

// function GoogleOAuthPage() {
//     return <div>Processing Google OAuth redirection...</div>
// }

// export default GoogleOAuthPage;


function navigate(url) {

    const width = 600, height = 600;
    const left = (window.innerWidth / 2) - (width / 2);
    const top = (window.innerHeight / 2) - (height / 2);

    // Open the authentication popup
    window.open(
        url,
        'AuthWindow',
        `width=${width},height=${height},top=${top},left=${left}`
    );

    window.addEventListener('message', handleGoogleAuthEvent, false);
    
}

export async function action() {
    try {
        console.log("Google auth submitted");

        const response = await fetch(`${API_URL}/oauth`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (!response.ok) {
            throw json({ message: 'Could not generate oAuth URL.' }, { status: 500 });
        }

        const data = await response.json();
        console.log(data);
        console.log(data.authUrl);

        navigate(data.authUrl);
    } catch (error) {
        console.error('Error during Google OAuth login:', error);
    }
}