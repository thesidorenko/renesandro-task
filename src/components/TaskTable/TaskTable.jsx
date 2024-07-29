import './TaskTable.scss';
import { v4 as uuidv4 } from 'uuid';
import { RxArrowTopRight } from "react-icons/rx";
import { useState } from 'react';
import { getFormats } from '../../api/api';

const TaskTable = ({ tasks, selectedTask, handleInputChange, handleTaskNameClick }) => {
  const [result, setResults] = useState('');

  const handleGenerate = (task) => {
    const { task_name, dimension, template_id, amount, gen_type, images, texts } = task;
    const preparedTask = {
      task_name,
      dimension,
      template_id,
      amount,
      gen_type,
      image_layers: images.map(img => img.title),
      text_layers: texts
    }

    if (!preparedTask.task_name.trim() || preparedTask.image_layers.length === 0) {
      return;
    }

    getFormats(preparedTask)
      .then(res => {
        console.log(res.data);
        setResults(`https://testapi-jvqis72guq-lm.a.run.app/test_vidro/${task_name}_${dimension}/format_validation`);
      })
      .catch(err => console.log('There was an error making the request:', err));
  }

  return (
    <table className='table'>
      <thead>
        <tr>
          <th></th>
          <th>Task Name</th>
          <th>Dimension</th>
          <th>Template ID</th>
          <th>Images</th>
          <th>Text</th>
          <th>Amount</th>
          <th>Gen type</th>
          <th>Gen_tasks</th>
          <th>Result Ads</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task, index) => {
          const { id, task_name, images, texts, amount } = task;

          return (
            <tr key={id}>
              <td>{index + 1}</td>
              <td onClick={() => handleTaskNameClick(task)} className='td__input-name'>
                <input
                  value={task_name}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => handleInputChange(e, index, 'task_name')}
                  placeholder='Enter name'
                  required={task.id === selectedTask?.id}
                />
                {task_name && <RxArrowTopRight />}
              </td>
              <td className='td__text-center'>
                <select
                  name='dimension'
                  className='select-dimension select'
                  onChange={(e) => handleInputChange(e, index, 'dimension')}
                >
                  <option value="1x1">1x1</option>
                  <option value="9x16">9x16</option>
                  <option value="16x9">16x9</option>
                </select>
              </td>
              <td className='td__text-center'>
                <select
                  name="template_id"
                  onChange={(e) => handleInputChange(e, index, 'template_id')}
                  className='select select-templateid'
                >
                  <option value="mwpswxcudtwxb">mwpswxcudtwxb</option>
                  <option value="0xdoscyowl50c">0xdoscyowl50c</option>
                </select>
              </td>
              <td className='td__images'>
                {images?.map(image => <div key={uuidv4()} className='td__images-image'>{image.title}</div>)}
              </td>
              <td>{texts}</td>
              <td className='td__amount'>
                <input
                  type='number'
                  value={amount}
                  onChange={(e) => handleInputChange(e, index, 'amount')} />
              </td>
              <td>
                <select
                  name="gen_type"
                  className='select select-gen-type'
                  onChange={(e) => handleInputChange(e, index, 'gen_type')}
                >
                  <option value="cyclic">cyclic</option>
                  <option value="random">random</option>
                </select>
              </td>
              <td>
                <button
                  type='submit'
                  className='button-generate'
                  onClick={() => handleGenerate(task)}
                >
                  Generate
                </button>
              </td>
              <td className='td__result'>{result && <a target='_blank' href={result}>Folder</a>}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  );
};

export default TaskTable;
