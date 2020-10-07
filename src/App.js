import React, { useEffect, useRef, useState } from 'react';
import { nanoid } from 'nanoid';
import Form from './components/Form';
import FilterButton from './components/FilterButton';
import Todo from './components/Todo';
import { usePrevious } from './utils';

const FILTER_MAP = {
	All: () => true,
	Active: task => !task.completed,
	Completed: task => task.completed
};
const FILTER_NAMES = Object.keys(FILTER_MAP);

function App(props) {
	const [tasks, setTasks] = useState(props.tasks);
	const [filter, setFilter] = useState('All');

	const listHeadingRef = useRef(null);
	const prevTaskLength = usePrevious(tasks.length);

	const tasksNoun = tasks.filter(FILTER_MAP[filter]).length !== 1 ? 'tasks' : 'task';
	const tasksStatus = filter === 'All' ? 'remaining' : filter.toLowerCase();
	const headingText = `${tasks.filter(FILTER_MAP[filter]).length} ${tasksNoun} ${tasksStatus}`;

	const addTask = name => {
		const newTask = { id: `todo-${nanoid()}`, name, completed: false };
		setTasks([...tasks, newTask]);
	}

	const editTask = (id, newName) => {
		const editedTaskList = tasks.map(task => {
			return id === task.id ? { ...task, name: newName } : task;
		});
		setTasks(editedTaskList);
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

	useEffect(() => {
		if (tasks.length - prevTaskLength === -1) {
			listHeadingRef.current.focus();
		}
	}, [tasks.length, prevTaskLength]);

	const taskList = tasks
		.filter(FILTER_MAP[filter])
		.map(task => (
		<Todo 
			id={task.id} 
			name={task.name} 
			completed={task.completed}
			key={task.id} 
			onEdit={editTask}
			onCheck={toggleTaskCompleted}
			onDelete={deleteTask}
		/>
	));

	const filterList = FILTER_NAMES.map(name => (
		<FilterButton 
			key={name} 
			name={name} 
			isPressed={name === filter}
			onPress={setFilter}
		/>
	));

  return (
    <div className="todoapp stack-large">
      <h1>TodoMatic</h1>
      <Form onSubmit={addTask} />
      <div className="filters btn-group stack-exception">
				{filterList}
      </div>
      <h2 id="list-heading" tabIndex="-1" ref={listHeadingRef}>
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
