import { redirect } from "react-router-dom";
import LoginForm from "../../components/forms/LoginForm";
import { API_URL } from "../../App";

function LoginPage() {
    

    return (
         <div><LoginForm /></div>
    )
};

export default LoginPage;



export async function action ({ request }) {
    console.log("submitting");

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

