import { useState } from "react";
import { useNavigation, useActionData, Form, Link, useRouteLoaderData } from "react-router-dom";
import { useUserContext } from "../../pages/util/UserProvider";
import classes from '../css/ActivityForm.module.css'


function ActivityForm({ existingTags, method, activity }) {
    const token = useRouteLoaderData('root');

    const { userInfo } = useUserContext();
    const user_name = userInfo.user_name;
    const user_id = userInfo.user_id;

    const data = useActionData();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === 'submitting';

    const [typedTags, setTypedTags] = useState('');
    const [matchedTags, setMatchedTags] = useState([]);
    const [chosenTags, setChosenTags] = useState([]);

    if (activity && activity.tags) {
        setChosenTags(activity.tags);
    }

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

    // TODO: setup change user name button

    console.log(chosenTags);

    return (
        <>
        {!token && 
            <div>
                <h1>Please log in!</h1>
                <Link to='/auth?mode=login' >Log in</Link>
            </div>  
        }
        {token && 
            <Form method={method} >
                <h1>Add Activity</h1>
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
                    <div>{`User name: ${user_name}`}</div> 
                    <button>Change user name</button>             
                </div>
                
                {/* title */}
                <div>  
                    {data && data.errors.title && <span> * </span>}                       
                    <label htmlFor="title">
                        Title
                    </label>
                    <input 
                        id='title' 
                        type='text' 
                        name='title'
                        defaultChecked={activity ? activity.title : ''} 
                        placeholder='Title is here' 
                        required/>
                </div>
    
                {/* duration */}
                <div>
                    {data && data.errors.duration && <span> * </span>} 
                    <label htmlFor="duration">Duration</label><br/>
                    <select id='duration' type='duration' name='duration' defaultValue={activity ? activity.duration : ''} required>
                        <option value="5">less than 5 mins</option>
                        <option value="10">about 10 mins</option>
                        <option value="15">about 15 mins</option>
                        <option value="20">about 20 mins</option>
                        <option value="30">about 30 mins</option>
                        <option value="31">30 mins and more</option>
                    </select> 
                </div>
    
                {/* age group */}
                <div>
                    <div>Target Age Group</div>
                    {data && data.errors.age_group && <span> * </span>}
                    <input type="radio" id="allAge" name="age_group" value="allAge" checked={activity && activity.age_group === "allAge"}/>
                        <label htmlFor="allAge">all age group!</label>
                    <input type="radio" id="teensAndAdults" name="age_group" value="teensAndAdults" checked={activity && activity.age_group === "teensAndAdults"}/>
                        <label htmlFor="teensAndAdults">teenagers and adults</label>
                    <input type="radio" id="kids" name="age_group" value="kids"  checked={activity && activity.age_group === "kids"}/>
                        <label htmlFor="kids">kids</label>
                    <input type="radio" id="teens" name="age_group" value="teens"  checked={activity && activity.age_group === "teens"}/>
                        <label htmlFor="teens">teenagers</label>
                    <input type="radio" id="adults" name="age_group" value="adults"  checked={activity && activity.age_group === "adults"}/>
                        <label htmlFor="adults">adults</label>
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
                        defaultValue={activity ? activity.summary : ''}
                        placeholder="This game involves groups making a five-item list based on a topic and guessing each other's topics."
                        required/>
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
                        defaultValue={activity ? activity.objectives : ''}
                        placeholder="communication skill, planning skill"
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
                        defaultValue={activity ? activity.materials : ''}
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
                        defaultValue={activity ? activity.instructions : ''}
                        placeholder="
                            1. Assign each group a topic.
                            2. In the groups, participants compile a list of five items related to the given topic.
                            3. Groups share their lists with everyone, while other participants attempt to guess the topic based on the list.
                            4. The group that most people are able to guess correctly is the winner."
                        required/>
                </div>
    
                {/* Links */}
                <div>
                    {data && data.errors.links && <span> * </span>}  
                    <label htmlFor="links">If you have reference links, add them here</label><br />
                    <textarea 
                        id='links' 
                        name='links' 
                        rows="2" 
                        cols="60"
                        defaultValue={activity ? activity.links : ''}
                        placeholder="http://....." 
                    />
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
    
                {/* hidden input */}
                <input type="hidden" name="chosenTags" value={JSON.stringify(chosenTags)} />
                <input type="hidden" name="user_id" value={user_id} />
    
                <br/><button disabled={isSubmitting}>Submit</button><br />
                {isSubmitting && <p>Submitting...</p>}
            </Form>
        }
        </>
       
    )
};

export default ActivityForm;
