import { Form, Link } from 'react-router-dom';

function SignupForm(){
    return (
        <>
            <h1>Sign Up</h1>
            <Form>
                <div>
                    <label for="email">Email</label>
                    <input id='email' type='email' name='email' required/>
                </div>
                <div>
                    <label for="password">Password</label>
                    <input id='password' type='password' name='password' required/>
                </div>
                <div>
                    <Link to='login'>Log In</Link>
                </div>
                <button>Save</button>
            </Form>
        </>
    )
}

export default SignupForm;