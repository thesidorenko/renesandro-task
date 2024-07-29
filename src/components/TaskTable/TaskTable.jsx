import './TaskTable.scss';
import axios from 'axios';

const TaskTable = ({ tasks, selectedTask, handleInputChange, handleTaskNameClick }) => {
  const handleGenerateButton = (e) => {
    e.preventDefault();

    const { id, ...rest } = selectedTask;

    if (!rest.task_name.trim()) {
      return;
    }

    axios.post('https://fasteasy-jvqis72guq-lm.a.run.app/tz-front/generate_images', rest, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa('renesandro:qwerty1234')}`
      }
    })
      .then(res => console.log(res.data))
      .catch(err => console.log('There was an error making the request:', err));
  }

  return (
    <form onSubmit={handleGenerateButton}>
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
                  {/* {images?.map(image => <div key={uuidv4()} className='td__images-image'>{image.title}</div>)} */}
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
                    onClick={() => setSelectedTaskId(task.id)}
                  >
                    Generate
                  </button>
                </td>
                <td></td>
                {/* <td><a target='_blank' href={`https://testapi-jvqis72guq-lm.a.run.app/test_vidro/${task_name}_${dimension}/format_validation`}>Link</a></td> */}
              </tr>
            )
          })}
        </tbody>
      </table>
    </form>
  );
};

export default TaskTable;
