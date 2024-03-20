import { redirect, json } from "react-router-dom";
import AuthForm from "../../components/forms/AuthForm";
import { API_URL } from "../../App";

function SignUpPage(){
    return <div><AuthForm /></div>
}

export default SignUpPage;

export async function action ({ request }) {
    console.log("submitting");

    const data = await request.formData();
    const signUpData = {
        firstName: data.get('firstName'),
        lastName: data.get('lastName'),
        email: data.get('email'),
        password: data.get('password')
    };

    console.log("sign Up data: ", signUpData);

    const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: {
            'Content-type' : 'application/json'
        },
        body: JSON.stringify(signUpData)
    })
    
    console.log("response data: ", response);

    //error handling
    if (response.status === 422 || response.status === 401) {
        return response;
    };

    if (!response.ok){
        throw json({ message: 'Could not authenticate user.'}, { status: 500 });
    }


    return redirect('/auth');
}