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

    const handleDeleteTag = (e, index) => {
        e.preventDefault();
        console.log("index: ", index);
        setChosenTags(prevTags => prevTags.filter((tag, i) => i !== index))
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
                <input id='title' type='text' name='title' placeholder='Title is here' required/>
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

            {/* Objectives */}
            <div>
                {data && data.errors.objectives && <span> * </span>}  
                <label htmlFor="objectives">Objectives / Target skills</label><br />
                <textarea 
                    id='objectives' 
                    name='objectives' 
                    rows="2" 
                    cols="60" 
                    placeholder="communication skill, planning skill"
                    required/>
            </div>

              {/* Summary */}
              <div>
                {data && data.errors.summary && <span> * </span>}  
                <label htmlFor="summary">One Sentence Summary</label><br />
                <textarea 
                    id='summary' 
                    name='summary' 
                    rows="2" 
                    cols="60" 
                    placeholder="This is a game where groups make a five-item list regarding various topics."
                    required/>
            </div>

             {/* Materials */}
             <div>
                {data && data.errors.materials && <span> * </span>}  
                <label htmlFor="materials">Materials</label><br />
                <textarea 
                    id='materials' 
                    name='materials' 
                    rows="4" 
                    cols="60"
                    placeholder="papers, pens" 
                    required/>
            </div>

            {/* instructions */}
            <div>
                {data && data.errors.instructions && <span> * </span>}  
                <label htmlFor="instructions">Instructions</label><br />
                <textarea 
                    id='instructions' 
                    name='instructions' 
                    rows="10" 
                    cols="60" 
                    placeholder="
                        1. Assign each group a topic.
                        2. In the groups, participants compile a list of five items related to the given topic.
                        3. Groups share their lists with everyone, while other participants attempt to guess the topic based on the list.
                        4. The group that most people are able to guess correctly is the winner."
                    required/>
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
                placeholder="icebreaker"
            /><br />

            {typedTags.length > 0 && (
                <div>
                    <p>Suggesting Tags: click to add
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

            <div>This activity's tags:
                {chosenTags.map((tag, index) => (
                    <div key={tag}>
                        <span>#{tag} </span>
                        <button onClick={(e) => handleDeleteTag(e, index)}>X</button>
                    </div>
                ))}
            </div>

            {/* hidden input for chosenTags */}
            <input type="hidden" name="chosenTags" value={JSON.stringify(chosenTags)} />

            <br/><button disabled={isSubmitting}>Submit</button><br />
            {isSubmitting && <p>Submitting...</p>}
        </Form>
    )
};

export default NewActivityForm;