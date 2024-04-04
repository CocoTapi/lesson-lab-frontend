import { useState } from "react";
import { useNavigation, useActionData, Form } from "react-router-dom";

function NewActivityForm({ existingTags }) {
    const data = useActionData();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === 'submitting';
    const [typedTags, setTypedTags] = useState('');
    const [matchedTags, setMatchedTags] = useState([]);
    const [chosenTags, setChosenTags] = useState([]);

    const handleTypedTagsChange = (event) => {
        const typedValue = event.target.value;
        setTypedTags(typedValue);
        const matched = existingTags.filter(tag =>
        tag.toLowerCase().includes(typedValue.toLowerCase())
        );
        setMatchedTags(matched);
    };

    const handleTagSelection = (e, selectedTag) => {
        e.preventDefault();
        // Check if the selected tag is already chosen
        if (!chosenTags.includes(selectedTag)) {
            setChosenTags(prevTags => [...prevTags, selectedTag]);
        }
        setTypedTags('');
    };

    const handleCreateTag = (e, newTag) => {
        e.preventDefault();

        if (chosenTags.includes(newTag)) {
            console.log("tag is already in chosenTags")
        } else {
            setChosenTags(prevTags => [...prevTags, newTag]);
        }
        setTypedTags('');
    }

    console.log(chosenTags);

    //TODO: tags

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
                <select id='duration' type='duration' name='duration' placeholder='duration' required>
                    <option value="10">Less than 10 mins</option>
                    <option value="11~20">11 ~ 20 mins</option>
                    <option value="21~30">21 ~ 30 mins</option>
                    <option value="30">More than 30 mins</option>
                </select> 
            </div>

            {/* age group */}
            <div>
                <div>Target Age Group</div>
                {data && data.errors.ageGroup && <span> * </span>}
                <input type="radio" id="allAge" name="ageGroup" value="allAge" />
                    <label htmlFor="allAge">all age group!</label>
                <input type="radio" id="TeensAndAdults" name="ageGroup" value="TeensAndAdults" />
                    <label htmlFor="TeensAndAdults">teenagers and adults</label>
                <input type="radio" id="kids" name="ageGroup" value="kids" />
                    <label htmlFor="kids">kids</label>
                <input type="radio" id="teens" name="ageGroup" value="teens" />
                    <label htmlFor="teens">teenagers</label>
                <input type="radio" id="adults" name="ageGroup" value="adults" />
                    <label htmlFor="adults">adults</label>
            </div>

            {/* instructions */}
            <div>
                {data && data.errors.instruction && <span> * </span>}  
                <label htmlFor="instruction">Instruction</label><br />
                <textarea id='instruction' name='instruction' rows="10" cols="30" required/>
            </div>

           {/* tags */}
            <div>Register tags</div>
            <label htmlFor="typedTags">Type your hashtags:</label><br />
            <input 
            type="text" 
            id="typedTags" 
            name="typedTags" 
            value={typedTags} 
            onChange={handleTypedTagsChange} 
            /><br />
            <p>This activity's tags: 
            {chosenTags.map(tag => (
                <span key={tag}>#{tag} </span>
            ))}
            </p>

            {typedTags.length > 0 && (
                <div>
                    <p>Suggesting Tags:
                    {matchedTags.length > 0 && (
                        matchedTags.map(tag => (
                            <button key={tag} onClick={(e) => handleTagSelection(e, tag)}>
                            #{tag}
                            </button>
                        ))
                    )}
                    <button onClick={(e) => handleCreateTag(e, typedTags)}>#{typedTags}</button>
                    </p>
                </div>
            )}

            <br/><button disabled={isSubmitting}>Submit</button><br />
            {isSubmitting && <p>Submitting...</p>}
        </Form>
    )
};

export default NewActivityForm;