import { Form, Link, useActionData, useNavigation } from 'react-router-dom';
import File from '../UI/File';
import ButtonS from '../UI/ButtonS';
import { FaCheck } from 'react-icons/fa';
import classes from '../css/user_page/ProfileForm.module.css'
import ButtonM from '../UI/ButtonM';
import { useState } from 'react';



function ProfileForm({ userProfile }) {
    const [passwordChange, setPasswordChange] = useState(false);
    const data = useActionData();
    const navigation = useNavigation();
    const user_id = userProfile.user_id;

    const passwordCangeHandler = (event) => {
        event.preventDefault();
        const proceed = window.confirm(`Are you sure you want to change password`);
        if(proceed) setPasswordChange(!passwordChange);
    }

    const isSubmitting = navigation.state === 'submitting';

    return (
        <File>
            <div className={classes.outerFrame}>
                <div className={classes.pageTitle}>
                    <h1>Edit Profile</h1>
                </div>
                <div className={classes.profileBox}>
                    <div className={classes.profileContents}>
                        <Form method='patch'>
                            {data && data.message && <p className={classes.errorMessages}>{data.message}</p>}
                            {data && data.errors &&
                                <ul className={classes.errorMessages}>
                                    {Object.values(data.errors).map((err) => (
                                        <li key={err}>{err}</li>
                                    ))}
                                </ul>
                            }
                            <div>
                                <div  className={classes.item}>
                                    <label htmlFor="user_name">
                                        {data && data.errors.user_name && <span className={classes.errorSpan}> * </span>}
                                        User Name :
                                        </label>
                                    <input id='user_name' type='text' name='user_name'  defaultValue={userProfile.user_name} required />
                                </div>
                                <div className={classes.item}>
                                    <label htmlFor="email">
                                        {data && data.errors.email && <span className={classes.errorSpan}> * </span>}
                                        E-mail :
                                    </label>
                                    <input id='email' type='email' name='email'  defaultValue={userProfile.email} required />
                                </div>
                                <div className={classes.item}>
                                    <label htmlFor="first_name">
                                        {data && data.errors.first_name && <span className={classes.errorSpan}> * </span>}
                                        First Name :
                                    </label>
                                    <input id='first_name' type='text' name='first_name' defaultValue={userProfile.first_name} required />
                                </div>
                                <div className={classes.item}>
                                    <label htmlFor="last_name">
                                        {data && data.errors.last_name && <span className={classes.errorSpan}> * </span>}
                                        Last Name :
                                    </label>
                                    <input id='last_name' type='text' name='last_name'  defaultValue={userProfile.last_name} required />
                                </div>
                                {userProfile.hasOwnProperty('password')? '' : 
                                <>
                                    <div className={classes.item}>
                                        
                                        <label htmlFor="password">
                                        {data && (data.errors.length || data.errors.simbol || data.errors.num)
                                            && <span className={classes.errorSpan}> * </span>
                                        }
                                            Password :
                                        </label>
                                        {!passwordChange && 
                                            <div className={classes.passwordButtonComponent}>
                                                <button onClick={passwordCangeHandler} className={classes.passwordButton} >Change Password</button>
                                            </div>
                                        }
                                        {passwordChange && 
                                            <input id='password' type='password' name='password' required />
                                        }
                                    </div>
                                    {passwordChange &&
                                        <div className={classes.item}>
                                            <label htmlFor="confirmPassword">
                                                {data && data.errors.confirmPassword && <span className={classes.errorSpan}> * </span>}
                                                Confirm Password :
                                            </label>
                                            <input id='confirmPassword' type='password' name='confirmPassword' placeholder='password' required />
                                        </div>
                                    }
                                </>
                                }
                               
                            </div>
                            <input type="hidden" name="user_id" value={user_id} /> 
                            <div className={classes.buttons}>
                                {isSubmitting && <p>Submitting...</p>}
                                <ButtonS colorScheme="primary" disabled={isSubmitting}  >
                                    <FaCheck className={classes.submitIcon}/>
                                    Submit
                                </ButtonS>         
                            </div>   
                        </Form>
                        <div>                 
                            <Link to='../' className={classes.editButton}>
                                <ButtonS colorScheme='greyBorder'>Cancel</ButtonS>
                            </Link>
                        </div>
                    </div>
                </div> 
            </div>   
        </File>
    )
}

export default ProfileForm;

