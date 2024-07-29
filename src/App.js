import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import TaskTable from './components/TaskTable/TaskTable';
import TaskCard from './components/TaskCard/TaskCard';
import { getImage } from './api/api';

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

  return (
    <div className="App">
      <div className="container">
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
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
