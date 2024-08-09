import { useState } from "react";
import { useActionData, useNavigation } from "react-router-dom";

function FileUploadForm(){
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
            inputs.splice(index, 1);

            return inputs;
        })
    }

    return (
        <form>
            {data && data.errors &&
                <ul>
                    {Object.values(data.errors).map((err) => (
                        <li key={err}>{err}</li>
                    ))}
                </ul>
            }
            {data && data.message && <p>{data.message}</p>}
            {/* file Upload */}
            <div>
                {data && data.errors.files && <span> * </span>}  
                {fileInputs}
            </div>
            <button onClick={handleAddFile}>Add file</button><br />

            <button disabled={isSubmitting}>Submit</button>
            {isSubmitting && <p>Submitting...</p>}
        </form>
    )
};

export default FileUploadForm;