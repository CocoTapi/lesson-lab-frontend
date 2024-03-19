import { Form, Link, useActionData, useNavigation } from 'react-router-dom';

function LoginForm(){
    const data = useActionData();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === 'submitting';
    //console.log(data);

    return (
        <Form method='post'>
            <h1>Login</h1>
            {data && data.errors &&
                <ul>
                    {Object.values(data.errors).map((err) => (
                        <li key={err}>{err}</li>
                    ))}
                </ul>
            }
            <div>
                <label htmlFor="email">Email</label>
                <input id='email' type='email' name='email' required/>
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input id='password' type='password' name='password' required/>
            </div>
            <div>
                <Link to='sign-up'>Create new user</Link>
            </div>
            <button disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Log In'}</button>
        </Form>
    )
}

export default LoginForm;