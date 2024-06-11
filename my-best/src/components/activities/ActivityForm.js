import { useEffect, useState } from "react";
import { useNavigation, useActionData, Form, Link, useRouteLoaderData, useLocation, useNavigate } from "react-router-dom";
import classes from '../css/activities/ActivityForm.module.css';
import { FaCheck } from "react-icons/fa";
import ButtonS from "../UI/ButtonS";
import ButtonM from "../UI/ButtonM";
import { IoTrashBinSharp } from "react-icons/io5";
import Tag from "../UI/Tag";


function ActivityForm({ existingTags, method, activity, locationState }) {   
    const user = useRouteLoaderData('root');
    let token;
    let user_name;
    let user_id;
    if(user) {
        token = user.token;
        user_name = user.user_name
        user_id = user.user_id;
    }
    const location = useLocation();
    const currentPath = location.pathname;
    const data = useActionData();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === 'submitting';
    const navigate = useNavigate();

    const [typedTags, setTypedTags] = useState('');
    const [matchedTags, setMatchedTags] = useState([]);
    const [chosenTags, setChosenTags] = useState([]);

   const prev_location = locationState? locationState.pathname : '/activities';

    let defaultLinks = '';
    if(activity && activity.links !== "null") defaultLinks = activity.links;
    

    useEffect(() => {
        if (activity && activity.tags) {
            setChosenTags(activity.tags);
        }
    }, [activity]);
    
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
        //console.log("index: ", index);
        setChosenTags(prevTags => prevTags.filter((tag, i) => i !== index))
    };

    const handleNavigate = () => {
        navigate('/auth?mode=login', { state: { prev_location: '/activities/new'}});

    }

    return (
        <div className={classes.frame}>
        {!token && 
            <div className={classes.login}>
                <h1>Please login first!</h1>
                <ButtonM onClick={handleNavigate}>Login</ButtonM>
            </div>  
        }
        {token && 
            <Form method={method} className={classes.form}>
                <div className={classes.left}>
                    <h1>{activity ? 'Edit Activity' : 'Add Activity'}</h1>
                    {data && data.errors &&
                        <ul>
                            {Object.values(data.errors).map((err) => (
                                <li key={err}>{err}</li>
                            ))}
                        </ul>
                    }
                    {data && data.message && <p>{data.message}</p>}
                    
                    {/* title */}
                    <div className={classes.formGroup}>  
                        {data && data.errors.title && <span> * </span>}                       
                        <label htmlFor="title">
                            Title
                        </label>
                        <input 
                            id='title' 
                            type='text' 
                            name='title'
                            defaultValue={activity ? activity.title : ''} 
                            placeholder='Title is here' 
                            required/>
                    </div>
        
                    {/* duration */}
                    <div className={classes.formGroup}>
                        {data && data.errors.duration && <span> * </span>} 
                        <label htmlFor="duration">Duration</label>
                        <select id='duration' type='duration' name='duration' defaultValue={activity ? activity.duration : ''} className={classes.formSelect} required>
                            <option value="5">less than 5 mins</option>
                            <option value="10">about 10 mins</option>
                            <option value="15">about 15 mins</option>
                            <option value="20">about 20 mins</option>
                            <option value="30">about 30 mins</option>
                            <option value="31">30 mins and more</option>
                        </select> 
                    </div>
                    
        
                    {/* age group */}
                    <div className={classes.formGroup}>
                        {data && data.errors.age_group && <span> * </span>}
                        <label htmlFor="age_group">Age group</label>
                        <select id='age_group' type='age_group' name='age_group' defaultValue={activity ? activity.age_group : ''} className={classes.formSelect} required>
                            <option value="all age">all age</option>
                            <option value="teens and adults">teens and adults</option>
                            <option value="kids">kids</option>
                            <option value="teens">teens</option>
                            <option value="adults">adults</option>
                        </select> 
                    </div>
        
                    {/* Summary */}
                    <div className={classes.formGroup}>
                        {data && data.errors.summary && <span> * </span>}  
                        <label htmlFor="summary">Summary</label>
                        <textarea 
                            className={classes.summary}
                            id='summary' 
                            name='summary' 
                            defaultValue={activity ? activity.summary : ''}
                            placeholder="A short one sentence summary"
                            required/>
                    </div>
        
                    {/* Objectives */}
                    <div className={classes.formGroup}>
                        {data && data.errors.objectives && <span> * </span>}  
                        <label htmlFor="objectives">Objectives / Target Skills</label>
                        <textarea 
                            className={classes.objectives}
                            id='objectives' 
                            name='objectives' 
                            defaultValue={activity ? activity.objectives : ''}
                            placeholder="Objectives and/or target skills"
                            required/>
                    </div>
        
                    {/* Materials */}
                    <div className={classes.formGroup}>
                        {data && data.errors.materials && <span> * </span>}  
                        <label htmlFor="materials">Materials</label>
                        <input 
                            id='materials' 
                            name='materials' 
                            defaultValue={activity ? activity.materials : ''}
                            placeholder="papers, pens" 
                            required/>
                    </div>
        
                    {/* instructions */}
                    <div className={classes.formGroup}>
                        {data && data.errors.instructions && <span> * </span>}  
                        <label htmlFor="instructions">Instructions</label>
                        <textarea 
                            className={classes.instructions}
                            id='instructions' 
                            name='instructions' 
                            defaultValue={activity ? activity.instructions : ''}
                            placeholder=" 1. first step
                                2. second step
                                3. third step
                                4. forth step
                                5. fifth step ..."
                            required/>
                    </div>
        
                    {/* tags */}
                    <div className={classes.tagInput}>
                    <label htmlFor="typedTags">Type tag name that you want to add :</label>
                        <input 
                            type="text" 
                            id="typedTags" 
                            name="typedTags" 
                            value={typedTags} 
                            onChange={handleTypedTagsChange} 
                            placeholder="icebreaker"
                        />
                    </div>
                        
        
                    {typedTags.length > 0 && (
                        <div className={classes.tagSelection}>
                            <h2>Click tags to select :</h2>
                            {matchedTags.length > 0 && (
                                matchedTags.map(tag => (
                                    <Tag className={classes.beforeTag} key={tag} onClick={(e) => handleTagSelection(e, tag)}>
                                        <h4>{tag}</h4>
                                    </Tag>
                                ))
                            )}
                            <Tag className={classes.beforeTag}  onClick={(e) => handleCreateTag(e, typedTags)}>
                                <h4>{typedTags}</h4>
                            </Tag>
                        </div>
                    )}
        
                    <div className={classes.tagSelection}>
                        <h2>Registered tags :</h2>
                        {chosenTags.length === 0 && <p>You haven't selected any tags yet.</p>}
                        {chosenTags.map((tag, index) => (
                            <Tag colorScheme="primary" className={classes.afterTag} key={tag} onClick={(e) => e.preventDefault()} >
                                <h4>{tag}</h4>
                                <p className={classes.deleteTag} onClick={(e) => handleDeleteTag(e, index)}><IoTrashBinSharp /></p>
                            </Tag>
                        ))}
                    </div>

                    {/* Links */}
                    <div className={classes.formGroup}>
                        {data && data.errors.links && <span> * </span>}  
                        <label htmlFor="links">Reference URLs</label>
                        <textarea 
                            className={classes.references}
                            id='links' 
                            name='links' 
                            defaultValue={defaultLinks}
                            placeholder="http://....." 
                        />
                    </div>
        
                    {/* hidden input */}
                    <input type="hidden" name="chosenTags" value={JSON.stringify(chosenTags)} />
                    <input type="hidden" name="user_id" value={user_id} />
                    <input type="hidden" name="user_name" value={user_name} />
                    <input type="hidden" name="prev_location" value={prev_location} />

                </div>
               
    
                <div className={classes.right}>
                    {isSubmitting && <p>Submitting...</p>}
                    <ButtonS colorScheme="primaryBorder" disabled={isSubmitting}  >
                        <h4><FaCheck /></h4>
                        <h4>Submit</h4>
                    </ButtonS>
                </div>
                
            </Form>
        }
        </div>
       
    )
};

export default ActivityForm;
