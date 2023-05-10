/* eslint-disable no-case-declarations */
import { NextApiRequest, NextApiResponse } from 'next';
import redis from 'redis';
const redisClient = redis.createClient();


const todosRouteHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	await redisClient.connect();

	// handle GET, PUT, POST, DELETE
	if (req.method === 'GET') {
		// get all todos
		const todos = await redisClient.get('todos');
		res.status(200).json(JSON.parse(todos ?? '[]'));
	}
	else if (req.method === 'POST') {
		// create new todo
		const { todo } = req.body;
		console.log(todo);
		const todos = JSON.parse(await redisClient.get('todos') ?? '[]');
		const newTodos = JSON.stringify([...todos, todo]);
		await redisClient.set('todos', newTodos);
		res.status(200).json(newTodos);
	}
	else if (req.method === 'PUT') {
		// update todo
		const todo = req.body;
		const todos = JSON.parse(await redisClient.get('todos') ?? '[]');
		const newTodos = JSON.stringify(todos.map((t: any) => t.id === todo.id ? todo : t));
		await redisClient.set('todos', newTodos);
		res.status(200).json(newTodos);
	}
	else if (req.method === 'DELETE') {
		// delete todo
		const { id } = req.body;
		const todos = JSON.parse(await redisClient.get('todos') ?? '[]');
		const newTodos = JSON.stringify(todos.filter((t: any) => t.id !== id));
		await redisClient.set('todos', newTodos);
		res.status(200).json(newTodos);
	}
	else {
		res.status(405).json({ message: 'Method not allowed' });
	}

	await redisClient.disconnect();
};

export default todosRouteHandler;