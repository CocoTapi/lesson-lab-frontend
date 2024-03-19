import { Form, Link } from 'react-router-dom';

function SignupForm(){
    return (
        <>
            <h1>Sign Up</h1>
            <Form>
                <div>
                    <label for="firstName">First Name</label>
                    <input id='firstName' type='firstName' name='firstName' placeholder='First Name' required/>
                </div>
                <div>
                    <label for="lastName">Last Name</label>
                    <input id='lastName' type='lastName' name='lastName' placeholder='Last Name' required/>
                </div>
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
                <button>Sign Up</button>
            </Form>
        </>
    )
}

export default SignupForm;