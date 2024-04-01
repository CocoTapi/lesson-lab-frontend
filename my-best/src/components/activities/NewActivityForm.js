import { useNavigation, useActionData, Form } from "react-router-dom";

function NewActivityForm() {
    const data = useActionData();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === 'submitting';

    //TODO: add a function to upload more files

    return (
        <Form method='post'>
            <h1>Add Activity</h1>
            {data && data.errors &&
                <ul>
                    {Object.values(data.errors).map((err) => (
                        <li key={err}>{err}</li>
                    ))}
                </ul>
            }
            {data && data.message && <p>{data.message}</p>}
            {/* title */}
            <div>
                {data && data.errors.title && <span> * </span>}                       
                <label htmlFor="title">
                    Title
                </label>
                <input id='title' type='title' name='titlee' placeholder='title' required/>
            </div>

            {/* duration */}
            <div>
                {data && data.errors.duration && <span> * </span>} 
                <label htmlFor="duration">Duration</label>
                <select id='duration' type='duration' name='duration' placeholder='duration' multiple required>
                    <option value="~10">Less than 10 mins</option>
                    <option value="11~20">11 ~ 20 mins</option>
                    <option value="21~30">21 ~ 30 mins</option>
                    <option value="30~">More than 30 mins</option>
                </select> 
            </div>

            {/* age group */}
            <div>
                {data && data.errors.ageGroup && <span> * </span>}
                <label htmlFor="ageGroup">This activity is for ...</label>
                <select id='ageGroup' type='ageGroup' name='ageGroup' required>
                    <option value="allAge">for all age group!</option>
                    <option value="olderThanYoungAdults">for older than young adults</option>
                    <option value="kids">Especially for kids</option>
                    <option value="youngAdults">Especially for young adults</option>
                    <option value="adults">Only for adults</option>
                </select>
            </div>

            {/* instructions */}
            <div>
                {data && data.errors.instructions && <span> * </span>}  
                <label htmlFor="instructions">Instructions</label>
                <input id='instructions' type='instructions' name='instructions' required/>
            </div>

            {/* handout */}
            <div>
                {data && data.errors.handout && <span> * </span>}  
                <label htmlFor="handout">Upload file</label>
                <input id='handout' type='handout' name='handout' />
            </div>
            <button disabled={isSubmitting}>Submit</button>
            {isSubmitting && <p>Submitting...</p>}
        </Form>
    )
};

export default NewActivityForm;