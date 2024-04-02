import { useState } from "react";
import { useNavigation, useActionData, Form } from "react-router-dom";

function NewActivityForm() {
    const [fileInputs, setFileInputs] = useState([]);
    const data = useActionData();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === 'submitting';

    const handleAddFile = (event) => {
        event.preventDefault();
        setFileInputs((prevFileInputs) => [...prevFileInputs, 
            <div key={prevFileInputs.length}>
                <button onClick={() => handleDeleteFile(prevFileInputs.length)}>X</button>
                <label htmlFor={`file${prevFileInputs.length}`} >Upload file {prevFileInputs.length}</label>
                <input id={`file${prevFileInputs.length}`} type='file' name={`file${prevFileInputs.length}`} /><br/>
            </div>
        ] );
    }

    const handleDeleteFile = (index) => {
       
        setFileInputs((prevFileInputs) => {
            const inputs = [...prevFileInputs];
            console.log(inputs);
            inputs.splice(index, 1);
            console.log(index, inputs)

            return inputs;
        })
    }

    //TODO: fix add and delete file function

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
                <input id='title' type='text' name='title' placeholder='title' required/>
            </div>

            {/* duration */}
            <div>
                {data && data.errors.duration && <span> * </span>} 
                <label htmlFor="duration">Duration</label><br/>
                <select id='duration' type='duration' name='duration' placeholder='duration' multiple required>
                    <option value="~10">Less than 10 mins</option>
                    <option value="11~20">11 ~ 20 mins</option>
                    <option value="21~30">21 ~ 30 mins</option>
                    <option value="30~">More than 30 mins</option>
                </select> 
            </div>

            {/* age group */}
            <div>
                <div>Target Age Group</div>
                {data && data.errors.ageGroup && <span> * </span>}
                <input type="radio" id="allAge" name="ageGroup" value="allAge" />
                    <label htmlFor="allAge">all age group!</label><br/>
                <input type="radio" id="TeensAndAdults" name="ageGroup" value="TeensAndAdults" />
                    <label htmlFor="TeensAndAdults">teenagers and adults</label><br/>
                <input type="radio" id="kids" name="ageGroup" value="kids" />
                    <label htmlFor="kids">kids</label><br/>
                <input type="radio" id="teens" name="ageGroup" value="teens" />
                    <label htmlFor="teens">teenagers</label><br/>
                <input type="radio" id="adults" name="ageGroup" value="adults" />
                    <label htmlFor="adults">adults</label>
            </div>

            {/* instructions */}
            <div>
                {data && data.errors.instruction && <span> * </span>}  
                <label htmlFor="instruction">Instruction</label>
                <input id='instruction' type='text' name='instruction' required/>
            </div>

            {/* file Upload */}
            <div>
                {data && data.errors.files && <span> * </span>}  
                {fileInputs}
            </div>
            <button onClick={handleAddFile}>Add file</button><br />

            <button disabled={isSubmitting}>Submit</button>
            {isSubmitting && <p>Submitting...</p>}
        </Form>
    )
};

export default NewActivityForm;