import * as types from '../actions/actionTypes';
import initialState from './initialState';

const transformToMap = (todos) => {
	const result = {};

	todos.forEach((todo) => {
		if (result[todo.tomatoContextId]) {
			result[todo.tomatoContextId].push(todo);
		} else {
			result[todo.tomatoContextId] = [];
		}
	});

	return result;
};

export default function todoReducer(state = initialState.todos, action) {
	switch (action.type) {
		case types.SAVE_TODO_SUCCESS:
			return state;
		case types.LOAD_TODOS_SUCCESS:
			return transformToMap(action.todos);
		case types.UPDATE_TODO_SUCCESS:
			return state;
		case types.SET_TODOS_SUCCESS:
			return {
				...state,
				[action.ctxId]: action.todos
			};
		case types.DELETE_TODO_SUCCESS:
			return state;
		default:
			return state;
	}
}
