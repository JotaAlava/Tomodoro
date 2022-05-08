import { dataSource } from './dsService';
import { postItem, putItem, getItem, deleteItem } from './itemService';
import { CONSTANTS } from '../shared/shared';

export async function load(token, userId) {
	const body = {
		productId: process.env.PRODUCT_ID,
		userId: userId
	};

	try {
		return dataSource(CONSTANTS.DATASOURCES.GET_TODOS, token, body).then(
			(res) => {
				return Array.isArray(res) ? res : {};
			}
		);
	} catch (e) {
		throw new Error(e);
	}
}

export function save(todo, token, userId) {
	const newContextItem = {
		name: `New todo for user ${userId}.`,
		description: `New todo for user ${userId}.`,
		productId: process.env.PRODUCT_ID,
		deleted: false,
		data: [
			{
				todo: {
					tomatoContextId: todo.tomatoContextId,
					completed: false,
					deleted: false,
					value: todo.value
				}
			}
		]
	};

	return postItem(newContextItem, token);
}

export async function update(newTodoItemState, token) {
	const oldTodoItemRes = await getItem(newTodoItemState._itemId, token);
	const oldTodoItem = oldTodoItemRes[0];

	// This type of update only works when we allow one entry per datar row
	oldTodoItem.data[0].todo = JSON.parse(JSON.stringify(newTodoItemState));

	return putItem(oldTodoItem, token);
}

export function remove(contextItemId, token) {
	return deleteItem(contextItemId, token);
}
