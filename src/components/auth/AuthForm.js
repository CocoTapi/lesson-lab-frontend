import { Form, Link, useActionData, useNavigation, useSearchParams } from 'react-router-dom';
import ButtonM from '../UI/ButtonM';
import classes from '../css/auth/AuthForm.module.css';
import { useState } from 'react';
import { googleOAuthAction } from '../../pages/auth/googleOAuth';
import { FcGoogle } from "react-icons/fc";

function AuthForm({ locationState }) {
    const data = useActionData();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === 'submitting';
    const [setLoading] = useState(false);   
    const prev_location = locationState? locationState: '/';

    const googleLoginHandler = () => {
        setLoading(true);
        googleOAuthAction();
    }

    const [searchParams] = useSearchParams();
    const isLogin = searchParams.get('mode') === 'login';

    return (
        <div className={classes.formContainer}>
            <Form method='post' className={classes.form}>
                <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
                {data && data.message && <h4 className={classes.errorMessages}>{data.message}</h4>}
                {data && data.errors &&
                    <ul>
                        {Object.values(data.errors).map((err) => (
                            <li key={err}>{err}</li>
                        ))}
                    </ul>
                }
                    {!isLogin &&
                        <div className={classes.nameGroup}>
                            <div className={classes.formName}>
                                <label htmlFor="firstName">
                                    {data && data.errors.firstName && <span> * </span>}
                                    First Name
                                </label>
                                <input id='firstName' type='text' name='firstName' placeholder='First Name' required />
                            </div>
                            <div className={classes.formName}>
                                <label htmlFor="lastName">
                                    {data && data.errors.lastName && <span> * </span>}
                                    Last Name 
                                </label>
                                <input id='lastName' type='text' name='lastName' placeholder='Last Name' required />
                            </div>
                        </div>
                    }

                    {/* e-mail */}
                    <div className={classes.formGroup}>
                        <label htmlFor="email">
                            {data && data.errors.email && <span> * </span>}
                            E-mail
                        </label>
                        <input id='email' type='email' name='email' placeholder='E-mail' required />
                    </div>
                    {/* confirm e-mail */}
                    {!isLogin &&
                        <div className={classes.formGroup}>
                            <label htmlFor="confirmEmail">
                                {data && data.errors.confirmEmail && <span> * </span>}
                                Confirm E-mail
                            </label>
                            <input id='confirmEmail' type='email' name='confirmEmail' placeholder='E-mail' required />
                        </div>
                    }
                
                    {/* password */}
                    <div className={classes.formGroup}>
                        <label htmlFor="password">
                            {data && (data.errors.length || data.errors.simbol || data.errors.num)
                                && <span> * </span>
                            }
                            Password
                        </label>
                        <input id='password' type='password' name='password' placeholder='password' required />
                    </div>

                    {/* confirm password */}
                    {!isLogin &&
                        <div className={classes.formGroup}>
                            <label htmlFor="confirmPassword">
                                {data && data.errors.confirmPassword && <span> * </span>}
                                Confirm Password
                            </label>
                            <input id='confirmPassword' type='password' name='confirmPassword' placeholder='password' required />
                        </div>
                    }
                    <div>

                    {/* Hidden input for redirection path */}
                    <input type="hidden" name="prev_location" value={prev_location} />

                    {isLogin ? (
                        <p>Haven't signed up yet? <Link to='/auth/signup'>Sign up</Link> instead.</p>
                    ) : (
                        <p>Already signed up? <Link to='/auth?mode=login'>Login</Link> instead.</p>
                    )}
                </div>
                <div className={classes.centerGroup}>
                    <ButtonM disabled={isSubmitting}>{isLogin ? 'Login' : 'Sign Up' }</ButtonM>
                    {isLogin && 
                    <>
                        <h3>or</h3>
                        <button className={classes.googleButton} onClick={googleLoginHandler}>
                            <FcGoogle className={classes.icon} /> 
                            Sign in with Google
                        </button>
                    </>
                    }
                    {isSubmitting && <p>Submitting...</p>}
                </div>
                
            </Form>
        </div>
    )
}

export default AuthForm;

