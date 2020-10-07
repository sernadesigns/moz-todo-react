import React, { useState } from 'react';
import { nanoid } from 'nanoid';
import Form from './components/Form';
import FilterButton from './components/FilterButton';
import Todo from './components/Todo';

function App(props) {
	const [tasks, setTasks] = useState(props.tasks);

	const tasksNoun = tasks.length !== 1 ? 'tasks' : 'task';
	const headingText = `${tasks.length} ${tasksNoun} remaining`;

	const addTask = name => {
		const newTask = { id: `todo-${nanoid()}`, name, completed: false };
		setTasks([...tasks, newTask]);
	}

	const toggleTaskCompleted = id => {
		const updatedTasks = tasks.map(task => {
			return id === task.id 
				? { ...task, completed: !task.completed } 
				: task;
		});
		setTasks(updatedTasks);
	}

	const deleteTask = id => {
		const remainingTasks = tasks.filter(task => id !== task.id);
		setTasks(remainingTasks);
	}

	const taskList = tasks.map(task => (
		<Todo 
			id={task.id} 
			name={task.name} 
			completed={task.completed}
			key={task.id} 
			onCheck={toggleTaskCompleted}
			onDelete={deleteTask}
		/>
	));

  return (
    <div className="todoapp stack-large">
      <h1>TodoMatic</h1>
      <Form onSubmit={addTask} />
      <div className="filters btn-group stack-exception">
				<FilterButton />
				<FilterButton />
				<FilterButton />
      </div>
      <h2 id="list-heading">
        {headingText}
      </h2>
			<ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading"
			>
				{taskList}
      </ul>
    </div>
  );
}

export default App;
