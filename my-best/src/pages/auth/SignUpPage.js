import SignupForm from "../../components/forms/SignupForm";

function SignUpPage(){
    return <SignupForm />
}

export default SignUpPage;

export async function action () {
    console.log("Sign Up!!!!")
}