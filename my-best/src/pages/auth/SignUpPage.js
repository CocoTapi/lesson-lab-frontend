import { redirect, json } from "react-router-dom";
import AuthForm from "../../components/forms/AuthForm";
import { API_URL } from "../../App";

function SignUpPage(){
    return <div><AuthForm /></div>
}

export default SignUpPage;

export async function action ({ request }) {
    const data = await request.formData();
    const firstName = data.get('firstName');
    const lastName = data.get('lastName');
    const email = data.get('email');
    const password = data.get('password');

    const signUpData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
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


    return redirect('/');
}