'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

function TodoItem({ todo, toggleTodo, removeTodo }) {
	return (
		<div className='flex items-center justify-between w-full px-4 py-2 mt-2 text-gray-700 bg-gray-200 rounded'>
			<div className='flex items-center'>
				<input
					className='mr-2 leading-tight'
					type='checkbox'
					checked={todo.completed}
					onChange={() => toggleTodo(todo.id)}
				/>
				<span className='text-sm'>{todo.text}</span>
			</div>
			<button
				className='px-4 py-2 text-gray-700 bg-gray-200 rounded active:bg-gray-400 hover:bg-gray-300'
				onClick={() => removeTodo()}
			>
				Remove
			</button>
		</div>
	);
}

function TodoList({ todos, toggleTodo, removeTodo }) {
	return (
		<div className='flex flex-col items-center justify-center mt-5 w-1/2 mx-auto'>
			{todos.map((todo) => (
				<TodoItem
					key={todo.id}
					todo={todo}
					toggleTodo={() => toggleTodo(todo.id)}
					removeTodo={() => removeTodo(todo.id)}
				/>
			))}
		</div>
	);
}

export default function Home() {
	const [todos, setTodos] = useState([
		{
			id: 1,
			text: 'Learn React',
			completed: false,
		},
	]);
	const [newTodo, setNewTodo] = useState('');

	const updateTodos = () => {
		axios
			.get('http://localhost:3000/api/todos')
			.then((res) => {
				console.log(res.data);
				setTodos(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	useEffect(() => {
		updateTodos();
	}, []);

	const addTodo = () => {
		const todo = {
			id: todos.length + 1,
			text: newTodo,
			completed: false,
		};
		console.log(todo);
		setNewTodo('');

		axios.post('http://localhost:3000/api/todos', {
			todo: todo,
		}).then((res) => {
			console.log(res.data);
			updateTodos();
		});
		// we'll add requests to the backend later on
	};
	const removeTodo = (id: number) => {
		console.log(`Removing ${id}...`);

		axios.delete('http://localhost:3000/api/todos/', {
			data: {
				id: id,
			},
		}).then((res) => {
			console.log(res.data);
			updateTodos();
		});
	};
	const toggleTodo = (id: number) => {
		console.log(`Toggling ${id} to ${!todos[id - 1].completed}...`);

		axios
			.put('http://localhost:3000/api/todos/', {
				id : id,
				text: todos[id - 1].text,
				completed: !todos[id - 1].completed,
			})
			.then((res) => {
				console.log(res.data);
				updateTodos();
			});
	};

	return (
		<main className='min-h-screen p-24'>
			<div className='z-10 w-full font-mono text-sm'>
				<h1 className='w-full text-4xl font-bold text-center text-gray-300'>
					Todos App
				</h1>
			</div>
			<div className='m-auto w-1/2 font-mono text-sm mt-5'>
				<input
					className='w-full m-auto px-4 py-2 text-gray-700 bg-gray-200 rounded'
					type='text'
					placeholder='Add a new todo...'
					value={newTodo}
					onChange={(e) => setNewTodo(e.target.value)}
				/>
				<br />
				<button
					className='px-4 py-2 mt-2 text-gray-700 bg-gray-200 rounded w-full active:bg-gray-400 hover:bg-gray-300'
					onClick={addTodo}
				>
					Add
				</button>
			</div>
			<TodoList
				todos={todos}
				toggleTodo={(id) => toggleTodo(id)}
				removeTodo={(id) => removeTodo(id)}
			/>
		</main>
	);
}