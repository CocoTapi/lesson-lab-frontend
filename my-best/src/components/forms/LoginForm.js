import { Form, Link } from 'react-router-dom';

function LoginForm(){
    return (
        <>
            <h1>Login</h1>
            <Form>
                <div>
                    <label for="email">Email</label>
                    <input id='email' type='email' name='email' required/>
                </div>
                <div>
                    <label for="password">Password</label>
                    <input id='password' type='password' name='password' required/>
                </div>
            </Form>
        </>
    )
}

export default LoginForm;