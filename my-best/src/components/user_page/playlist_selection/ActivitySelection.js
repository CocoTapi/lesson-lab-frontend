import { useState } from 'react';
import { Link } from 'react-router-dom';
import classes from '../../css/user_page/ActivitySelection.module.css';
import Modal from '../../UI/Modal';
import SelectionForm from './SelectionForm';
import { GoHeartFill } from "react-icons/go";
import TopButton from '../../UI/TopButton';

function ActivitySelection({ title, playlist_id, user_id, onSubmitActivities, onClose }){
    const [selectedList, setSelectedList ] = useState('');
    const [showSelection, setShowSelection ] = useState(false);

    const handleClick = (selection) => {
        setSelectedList(selection);
        setShowSelection(true);
    }

    const handleBackButton = () => {
        setShowSelection(false)
    }
  
    return (
        <Modal>
            {!showSelection &&
                <div className={classes.modalContents}>
                    <div className={classes.topButtonComponent}>
                        <TopButton onClick={onClose} >Back</TopButton>
                    </div>
                    <h3>Where do you want to choose an activity for this playlist?</h3>
                    <div className={classes.modalButtonComponent}>
                            <button className={classes.modalBigButton} onClick={() => handleClick('like')}>
                            <GoHeartFill />likes
                            </button>
                            <button className={classes.modalBigButton}  onClick={() => handleClick('upload')}>
                                My Uploads
                            </button>
                        <Link to={`../../../activities`} className={classes.linkButton}>
                            <button className={classes.modalBigButton}>
                                All activities
                            </button>
                       </Link>           
                    </div> 
                </div>
            }
            {showSelection && selectedList &&
                <SelectionForm 
                    selectedList={selectedList} 
                    playlist_id={playlist_id} 
                    user_id={user_id} 
                    title={title} 
                    onSubmitActivities={onSubmitActivities}
                    onClose={onClose}
                    onBacktoSelection={handleBackButton}
                />
            }
            
        </Modal>
       
    )
}

export default ActivitySelection