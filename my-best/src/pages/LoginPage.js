import { redirect } from "react-router-dom";
import LoginForm from "../components/forms/LoginForm";

function LoginPage() {
    return (
        <>
        <div><LoginForm /></div>
        <button type="button" onClick={() => googleOAuth()}>Google Login</button>
        </>
    )
};

export default LoginPage;

const API_URL = 'http://localhost:8080/';

export async function action ({ request }) {
    const data = await request.formData();
    const loginData = {
        email: data.get('email'),
        password: data.get('password')
    };

    console.log(loginData);

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                'Content-type' : 'application/json'
            },
            body: JSON.stringify(loginData)
        })
        console.log(response.data);
        return redirect('/');
    } catch(err) {
        console.log(err);
    }
    
}

function navigate(url) {
    window.location.href = url;
}

export async function googleOAuth() {
    const response = await fetch(`${API_URL}/oauth`, {
        method: "POST",
        headers: {
            'Content-Type' : 'application/json'
        }
    })
    const data = await response.json();
    navigate(data.url);
}