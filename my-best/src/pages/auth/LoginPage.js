import { redirect, json } from "react-router-dom";
import AuthForm from "../../components/auth/AuthForm";
import { API_URL } from "../../App";

function LoginPage() {

    return <AuthForm />
};

export default LoginPage;



export async function action ( {request, setUserInfo} ) {
    const data = await request.formData();
    const loginData = {
        email: data.get('email'),
        password: data.get('password')
    };
    console.log(loginData);

    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(loginData)
    })
    
    //error handling
    if (response.status === 422 || response.status === 401) {
        return response;
    };

    if (!response.ok){
        throw json({ message: 'Could not authenticate user.'}, { status: 500 });
    }
    
    const resData = await response.json();
    console.log("resData:", resData);

    const user_id = resData.data.user_id;
    const user_name = resData.data.user_name;
    const token = resData.token;

    console.log(user_id, user_name)
    console.log('token:', token);

    //setUserInfo({user_id, user_name});

    //await setupToken();

    localStorage.setItem('token', token);
    const expiration = new Date();
    expiration.setHours(expiration.getHours() + 1);
    localStorage.setItem('expiration', expiration.toISOString());

    return redirect(`/`);
}



