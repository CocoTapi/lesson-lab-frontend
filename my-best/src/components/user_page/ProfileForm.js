import { Form, Link, useActionData, useNavigation } from 'react-router-dom';



function ProfileForm({ userProfile }) {
    const data = useActionData();
    const navigation = useNavigation();
    const user_id = userProfile.user_id;

    const isSubmitting = navigation.state === 'submitting'

    return (
        <>
        <Form method='patch'>
            <h1>Profile</h1>
            {data && data.errors &&
                <ul>
                    {Object.values(data.errors).map((err) => (
                        <li key={err}>{err}</li>
                    ))}
                </ul>
            }
            {data && data.message && <p>{data.message}</p>}

             {/* user name */}
             <div>
                {data && data.errors.user_name && <span> * </span>
                }
                <label htmlFor="user_name">User name</label>
                <input id='user_name' type='text' name='user_name'  defaultValue={userProfile.user_name} required />
            </div>
    
            {/* name */}
            <div>
                {data && data.errors.first_name && <span> * </span>}
                <label htmlFor="first_name">
                    First Name
                </label>
                <input id='first_name' type='text' name='first_name' defaultValue={userProfile.first_name} required />
            </div>
            <div>
                {data && data.errors.last_name && <span> * </span>}
                <label htmlFor="last_name">Last Name</label>
                <input id='last_name' type='text' name='last_name'  defaultValue={userProfile.last_name} required />
            </div> 

            {/* email */}
            <div>
                {data && data.errors.email && <span> * </span>
                }
                <label htmlFor="email">Email</label>
                <input id='email' type='email' name='email'  defaultValue={userProfile.email} required />
            </div>

            {/* password */}
            <div>
                {data && (data.errors.length || data.errors.simbol || data.errors.num)
                    && <span> * </span>
                }
                <label htmlFor="password">Password</label>
                <input id='password' type='password' name='password' defaultValue={userProfile.email} required />
            </div>

            <input type="hidden" name="user_id" value={user_id} />
            
            <button disabled={isSubmitting}>Edit Profile</button>
            {isSubmitting && <p>Submitting...</p>}
            <Link to='../'>Back</Link>
        </Form>
        </>
    )
}

export default ProfileForm;

