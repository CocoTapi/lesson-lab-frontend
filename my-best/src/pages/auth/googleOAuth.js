import { API_URL } from "../../App";


function navigate(url) {
    window.location.href = url;
}

export async function action() {
    console.log("Google auth submitted");

    const response = await fetch(`${API_URL}/oauth`, {
        method: "POST",
        headers: {
            'Content-Type' : 'application/json'
        }
    })
    const data = await response.json();
    navigate(data.url);
}