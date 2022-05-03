import * as types from './actionTypes';
import { load, save, update, remove } from '../../services/todoService';
import { beginApiCall, apiCallError } from './apiStatusActions';

export function updateTodoSuccess(todo) {
	return { type: types.UPDATE_TODO_SUCCESS, todo };
}

export function createTodo(todo) {
	return { type: types.CREATE_TODO_SUCCESS, todo };
}

export function saveTodoSuccess(todo) {
	return { type: types.SAVE_TODO_SUCCESS, todo };
}

export function deleteTodoSuccess() {
	return { type: types.DELETE_TODO_SUCCESS };
}

export function loadTodosSuccess(todos) {
	return { type: types.LOAD_TODOS_SUCCESS, todos };
}

export function loadTodos(token, userId) {
	return function (dispatch) {
		dispatch(beginApiCall());
		return load(token, userId)
			.then((todos) => {
				dispatch(loadTodosSuccess(todos));

				// Is this an anti-pattern for redux?
				return todos;
			})
			.catch((err) => {
				dispatch(apiCallError(err));
				throw err;
			});
	};
}

export function saveTodo(todo, token, userId) {
	return function (dispatch) {
		return save(todo, token, userId)
			.then((savedCtx) => {
				dispatch(saveTodoSuccess(savedCtx));
			})
			.catch((err) => {
				dispatch(apiCallError(err));
				throw err;
			});
	};
}

export function updateTodo(todo, token, userId) {
	return function (dispatch) {
		return update(todo, token, userId)
			.then((savedTodo) => {
				dispatch(saveTodoSuccess(savedTodo));
			})
			.catch((err) => {
				dispatch(apiCallError(err));
				throw err;
			});
	};
}

export function deleteTodo(todoItemId, token) {
	return function (dispatch) {
		return remove(todoItemId, token)
			.then((savedCtx) => {
				dispatch(deleteTodoSuccess(savedCtx));
			})
			.catch((err) => {
				dispatch(apiCallError(err));
				throw err;
			});
	};
}
