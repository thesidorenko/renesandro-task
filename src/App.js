import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import TaskTable from './components/TaskTable/TaskTable';
import TaskCard from './components/TaskCard/TaskCard';

function App() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleCreateTask = () => {
    const task = {
      id: uuidv4(),
      task_name: '',
      dimension: '1x1',
      template_id: 'mwpswxcudtwxb',
      images: [],
      texts: ['text'],
      amount: 1,
      gen_type: 'cyclic'
    }
    setTasks(prev => [...prev, task]);
  }

  const handleCloseModal = (e) => {
    if (e.target === e.currentTarget) {
      setSelectedTask(null);
    }
  }

  const handleTaskNameClick = (task) => {
    if (task && task.task_name) {
      setSelectedTask(task);
    }
  };

  const handleInputChange = (e, index, fieldName) => {
    const newTasks = [...tasks];
    newTasks[index][fieldName] = e.target.value;
    setTasks(newTasks);
  }

  const handleCreateImageButton = (task) => {
    const newImage = {
      id: uuidv4(),
      title: `Image${task.images.length + 1}`,
      dimension: '1x1',
      style: '',
      manual_prompts: '',
      gen_per_ref: '',
      flow: '',
      images: []
    };
    setSelectedTask(prev => ({...prev, images: [newImage, ...prev.images]}));
    setTasks(prev => prev.map(el => {
      if (el.id === selectedTask.id) {
        return { ...el, images: [newImage, ...el.images]}
      }
      return el;
    }))
  }

  const handleGenerateImage = (image, taskId) => {
    getImage(image).then(res => {
      console.log(res.data);
      setTasks(prev => prev.map(task => task.id === taskId ? {...task, images: [image, ...task.images]} : task))
    })
    .catch(err => console.log('There was an error making the request:', err));
  }

  return (
    <div className="App">
      <div className="container">
        <header className="App__header">Renesandro</header>
        <button onClick={handleCreateTask} className='button-create'>Create new task</button>
        <TaskTable
          tasks={tasks}
          selectedTask={selectedTask}
          handleInputChange={handleInputChange}
          handleTaskNameClick={handleTaskNameClick}
        />
        {selectedTask && (
          <div onClick={handleCloseModal} className='modal-overlay'>
            <TaskCard
              task={selectedTask}
              setTasks={setTasks}
              setSelectedTask={setSelectedTask}
              handleCreateImageButton={handleCreateImageButton}
              onGenerateImage={handleGenerateImage}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
