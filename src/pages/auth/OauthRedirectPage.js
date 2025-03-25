import Home from "../../components/home/Home";

function OauthRedirectPage() {

    return <Home></Home>
};

export default OauthRedirectPage;

export async function onOauthRedirectLoad() {
    console.log(getCookie());
}

export async function loader({ _request, _params }) {
    
    // const id = params.user_id;
    //console.log("loader id", id);
    console.log(getCookie());
    return null;
}

// Function to extract the cookie value
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}



