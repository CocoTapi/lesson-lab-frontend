import { Form, Link, useActionData, useNavigation, useSearchParams } from 'react-router-dom';

function AuthForm(){
    const data = useActionData();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === 'submitting';
    //console.log(data);

    const [ searchParams ] = useSearchParams();
    const isLogin = searchParams.get('mode') === 'login';

    return (
        <Form method='post'>
            <h1>{isLogin ? 'Log In' : 'Create a new user'}</h1>
            {data && data.errors &&
                <ul>
                    {Object.values(data.errors).map((err) => (
                        <li key={err}>{err}</li>
                    ))}
                </ul>
            }
            {data && data.message && <p>{data.message}</p>}
            {!isLogin && 
            <>
                <div>
                    <label htmlFor="firstName">First Name</label>
                    <input id='firstName' type='firstName' name='firstName' placeholder='First Name' required/>
                </div>
                <div>
                    <label htmlFor="lastName">Last Name</label>
                    <input id='lastName' type='lastName' name='lastName' placeholder='Last Name' required/>
                </div>
            </>
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
                {isLogin ? (
                    <Link to='/auth/signup'>Sign Up</Link>
                ) : (
                    <Link to='/auth?mode=login'>Log In</Link>
                )}
            </div>
            <button disabled={isSubmitting}>{isLogin ? 'Log In' : 'Sign Up'}</button>
            {isSubmitting && <p>Submitting...</p>}
        </Form>
    )
}

export default AuthForm;

