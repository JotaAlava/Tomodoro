import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function todoReducer(state = initialState.todos, action) {
	switch (action.type) {
		case types.SAVE_TODO_SUCCESS:
			return state;
		case types.LOAD_TODOS_SUCCESS:
			return action.todos;
		case types.UPDATE_TODO_SUCCESS:
			return state;
		case types.DELETE_TODO_SUCCESS:
			return state;
		default:
			return state;
	}
}
