import { useState } from 'react';
import './TaskCard.scss';
import { RxCross1, RxChevronDown, RxChevronUp } from "react-icons/rx";
import { v4 as uuidv4 } from 'uuid';
import { ref, getDownloadURL, uploadBytes, deleteObject } from 'firebase/storage';
import { storage } from '../../firebase/firebaseConfig';

const TaskCard = ({ task, setTasks, setSelectedTask, onGenerateImage, handleCreateImageButton }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [expandedImages, setExpandedImages] = useState([]);

  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  // const [urls, setUrls] = useState([]);
  // const [images, setImages] = useState([])

  const toggleImage = (imageId) => {
    setExpandedImages(prev =>
      prev.includes(imageId) ? prev.filter(id => id !== imageId) : [...prev, imageId]
    );
  };

  const handleInputChange = (e, index, fieldName) => {
    const { value } = e.target;
    const newImages = [...task.images];
    newImages[index] = { ...newImages[index], [fieldName]: value };

    setSelectedTask(prev => ({ ...prev, images: newImages }));
  }

  const handleFileChange = (e, imageId) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    console.log("Selected Files:", selectedFiles);

    const filePreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews(filePreviews);

    selectedFiles.forEach((file) => {
      const storageRef = ref(storage, `images/${file.name}`);

      uploadBytes(storageRef, file).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {


          console.log("File available at:", url); // Log the file URL
          setTasks(prevTasks => prevTasks.map(el => {
            if (el.id === task.id) {
              return {
                ...el,
                images: el.images.map(layer => layer?.id === imageId ? { ...layer, images: [...layer.images, url]} : layer)
              }
            }
            return el;
          }
          ));
        });
      }).catch(error => {
        console.error("Error uploading file:", error);
      });
    });
  };

  const handleDeleteImageButton = (preview) => {
    const index = previews.indexOf(preview);

    if (index !== -1) {
      const filePath = `images/${files[index].name}`;
      const desertRef = ref(storage, filePath);

      deleteObject(desertRef).then(() => {
        console.log('Deleted from Firebase Storage');
        setFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
      }).catch((error) => {
        console.error("Error deleting file:", error);
      });
    }
  }

  const handleSubmit = (e, image) => {
    e.preventDefault();

    // if (Object.values(image).some(value => !value)) {
    //   alert('All fields must be filled.');
    //   return;
    // }
    // onGenerateImage(selectedImage, task.id);
  }

  return (
    <div className="task">
      <div className='task__top'>
        <h2 className='task__title'>{task.task_name}</h2>
        <button onClick={() => setSelectedTask(null)} className='button-close'><RxCross1 /></button>
      </div>
      <div className='form__images_top'>
        <h3>Image</h3>
        <button onClick={() => handleCreateImageButton(task)} type='button'>Create image</button>
      </div>
      <div className='task__images'>
        {task.images.map((image, index) => {
          const isExpanded = expandedImages.includes(image.id);
          const { dimension, manual_prompts, flow, gen_per_ref, style } = image;
          console.log({image})
          return (
            <form className='form__images' onSubmit={(e) => handleSubmit(e, image)} key={uuidv4()}>
              <div className='form__image' key={image.id}>
                <div className='image__top' onClick={() => toggleImage(image.id)}>
                  <p className='form__image_title'>{image.title}</p>
                  {isExpanded ? <RxChevronUp /> : <RxChevronDown />}
                </div>
                {isExpanded && (
                  <div className='form__inputs'>
                    <div className='form__input-wrapper'>
                      <label>Proportions</label>
                      <select
                        className='form__select'
                        value={dimension}
                        required
                        onChange={(e) => handleInputChange(e, index, 'dimension')}
                      >
                        <option value="1x1">1:1</option>
                        <option value="9x16">9:16</option>
                        <option value="16x9">16:9</option>
                      </select>
                    </div>
                    <div className='form__input-wrapper'>
                      <select className='form__select-flow form__field' value={flow} required onChange={(e) => handleInputChange(e, index, 'flow')}>
                        <option value="" disabled selected>Flow</option>
                        <option value="other_models_mix">other_models_mix</option>
                        <option value="mj_model">mj_model</option>
                      </select>
                    </div>
                    <div className='form__input-file'>
                      <label>Image refs</label>
                      <div className='preview__wrapper'>
                        {previews.map((preview, index) => (
                          <div key={index} className="image">
                            <button
                              type='button'
                              className='image__button-delete'
                              onClick={() => handleDeleteImageButton(preview)}
                            ><RxCross1 />
                            </button>
                            <img src={preview} alt='image' />
                          </div>
                        ))}
                      </div>
                      <input type="file" multiple onChange={(e) => handleFileChange(e, image.id)} />
                    </div>
                    <div className='form__input-wrapper'>
                      <input
                        type="text"
                        placeholder='Manual prompts (optional)'
                        className='form__field'
                        value={manual_prompts}
                        onChange={(e) => handleInputChange(e, index, 'manual_prompts')}
                      />
                    </div>
                    <div className='form__input-wrapper'>
                      <input
                        type="number"
                        min={1}
                        placeholder='Generates per ref'
                        required
                        className='form__field'
                        value={gen_per_ref}
                        onChange={(e) => handleInputChange(e, index, 'gen_per_ref')}
                      />
                    </div>
                    <div className='form__input-wrapper'>
                      <select className='form__select-styles form__field' value={style} onChange={(e) => handleInputChange(e, index, 'style')}>
                        <option value='' disabled selected>Styles</option>
                        <option value="An ultra-realistic photography">An ultra-realistic photography</option>
                        <option value="Anime style">Anime style</option>
                      </select>
                    </div>
                    <button className='task__generate-button' type='submit'>Generate</button>
                  </div>
                )}
              </div>
            </form>
          )
        })}
      </div>
    </div>
  )
}
export default TaskCard;
