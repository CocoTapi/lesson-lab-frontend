import Modal from "../UI/Modal";
const images = Array.from({ length: 20 }, (v, index) => 
    index + 1
    );

    console.log(images);

function SelectImage({ onImageSelect, selectedImage, onSelect }){
    const handleClick = (image) => {
        onImageSelect(image);
        onSelect();
    }

    return (
        <Modal>
            <div>Select an Image</div>
            <ul>
                {images.map((image) => (
                  <li
                    key={image}
                    onClick={() => handleClick(image)}
                  >
                    <img 
                        src={`/images/large/${image}.png`} 
                        alt={`activity-image-${image}`}
                    />
                  </li>
                ))}
            </ul>
        </Modal>
    )
} ;

export default SelectImage;