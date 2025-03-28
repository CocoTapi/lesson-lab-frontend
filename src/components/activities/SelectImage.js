import { baseName } from "../../App";
import ButtonS from "../UI/ButtonS";
import Modal from "../UI/Modal";
import classes from '../css/activities/SelectImage.module.css'


function SelectImage({ onImageSelect, selectedImage, onShowModal }){
    let images = Array.from({ length: 20 }, (v, index) => 
    index + 1
    );

    if(selectedImage) {
        images.splice(selectedImage - 1, 1);
    }

    const handleClick = (image) => {
        onImageSelect(image);
        onShowModal();
    }

    const handleCancel = () => {
        onShowModal();
    }

    return (
        <Modal>
            <h1>Image Selection</h1>
            {selectedImage &&
            <div>
                <h2>Currently Selected:</h2>
                <div className={classes.selectedImageFrame} onClick={handleCancel}>
                    <img src={`${baseName}/images/large/${selectedImage}.png`} alt="activityImage" />
                </div>
            </div>
            }

            <h1>Select an Image</h1>
            <ul className={classes.imageList}>
                {images.map((image) => (
                  <li
                    key={image}
                    onClick={() => handleClick(image)}
                    className={classes.imageFrame}
                  >
                    <img 
                        src={`${baseName}/images/large/${image}.png`} 
                        alt={`activity-image-${image}`}
                    />
                  </li>
                ))}
            </ul>
            <div className={classes.backButton}>
                <ButtonS onClick={handleCancel} >Back</ButtonS>
            </div>
        </Modal>
    )
} ;

export default SelectImage;