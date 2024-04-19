import { Form, Link, useActionData, useNavigation, useSearchParams } from 'react-router-dom';



function AuthForm() {
    const data = useActionData();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === 'submitting';

    const [searchParams] = useSearchParams();
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
                        {data && data.errors.firstName && <span> * </span>}
                        <label htmlFor="firstName">
                            First Name
                        </label>
                        <input id='firstName' type='text' name='firstName' placeholder='First Name' required />
                    </div>
                    <div>
                        {data && data.errors.lastName && <span> * </span>}
                        <label htmlFor="lastName">Last Name</label>
                        <input id='lastName' type='text' name='lastName' placeholder='Last Name' required />
                    </div>
                </>
            }
            <div>
                {data && data.errors.email && <span> * </span>
                }
                <label htmlFor="email">Email</label>
                <input id='email' type='email' name='email' required />
            </div>
            <div>
                {data && (data.errors.length || data.errors.simbol || data.errors.num)
                    && <span> * </span>
                }
                <label htmlFor="password">Password</label>
                <input id='password' type='password' name='password' required />
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

