import { Form, Link, useActionData, useNavigation } from 'react-router-dom';
import File from '../UI/File';
import ButtonS from '../UI/ButtonS';
import { FaCheck } from 'react-icons/fa';
import classes from '../css/user_page/ProfileForm.module.css'



function ProfileForm({ userProfile }) {
    const data = useActionData();
    const navigation = useNavigation();
    const user_id = userProfile.user_id;

    const isSubmitting = navigation.state === 'submitting'

    return (
        <File>
            <Form method='patch' className={classes.box}>
                <div className={classes.contents}>
                    {data && data.errors &&
                        <ul>
                            {Object.values(data.errors).map((err) => (
                                <li key={err}>{err}</li>
                            ))}
                        </ul>
                    }
                    {data && data.message && <p>{data.message}</p>}

                    <div className={classes.item}>
                        {data && data.errors.user_name && <span> * </span>
                            }
                        <label htmlFor="user_name"><h3>User Name :</h3></label>

                        {data && data.errors.email && <span> * </span>
                        }
                        <label htmlFor="email"><h3>E-mail :</h3></label>

                        {data && (data.errors.length || data.errors.simbol || data.errors.num)
                            && <span> * </span>
                        }
                        <label htmlFor="password"><h3>Password :</h3></label>

                        {data && data.errors.first_name && <span> * </span>}
                        <label htmlFor="first_name">
                            <h3>First Name :</h3>
                        </label>

                        {data && data.errors.last_name && <span> * </span>}
                        <label htmlFor="last_name"><h3>Last Name :</h3></label>
                    </div>

                    <div className={classes.item}>
                        <input id='user_name' type='text' name='user_name'  defaultValue={userProfile.user_name} required />
                        <input id='email' type='email' name='email'  defaultValue={userProfile.email} required />
                        <input id='password' type='password' name='password' defaultValue={userProfile.email} required />
                        <input id='first_name' type='text' name='first_name' defaultValue={userProfile.first_name} required />
                        <input id='last_name' type='text' name='last_name'  defaultValue={userProfile.last_name} required />
                    </div> 

                     <input type="hidden" name="user_id" value={user_id} />
                </div>  
                <div className={classes.right}>
                    <div className={classes.buttons}>
                        {isSubmitting && <p>Submitting...</p>}
                        <ButtonS colorScheme="primaryBorder" disabled={isSubmitting}  >
                                <h4><FaCheck /></h4>
                                <h4>Submit</h4>
                            </ButtonS>         
                    </div>
                    <div className={classes.buttons}>
                    <ButtonS>
                            <Link to='../'>Back</Link>
                        </ButtonS>
                    </div>
                        
                    </div>              
            </Form>
        </File>
    )
}

export default ProfileForm;

