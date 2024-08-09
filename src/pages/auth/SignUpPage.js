import { redirect, json } from "react-router-dom";
import AuthForm from "../../components/auth/AuthForm";
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
    const confirmEmail = data.get('confirmEmail'); 
    const password = data.get('password');
    const confirmPassword = data.get('confirmPassword');

    if (email !== confirmEmail) {
        return { 
            message: "Edit profile failed due to validation errors.",
            errors: {
                confirmEmail: 'The email confirmation does not match.'
            }};
    } else if (password !== confirmPassword){
        return { 
            message: "Edit profile failed due to validation errors.",
            errors: {
                confirmPassword: 'The password confirmation does not match.'
            }}
    }

    const signUpData = {
        first_name: firstName,
        last_name: lastName,
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

   //this make you show which item is invalid.
    if (response.status === 422 || response.status === 401) {
        return response;
    }

    if (!response.ok){
        throw json({ message: 'Could not authenticate user.'}, { status: 500 });
    }


    return redirect('/auth?mode=login');
}