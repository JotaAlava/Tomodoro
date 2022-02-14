import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function contextReducer(state = initialState.contexts, action) {
	switch (action.type) {
		case types.LOAD_CONTEXTS_SUCCESS:
			// TODO: Is there a react appropriate way of deep copying?
			return JSON.parse(JSON.stringify(action.contexts));
		case types.SAVE_CONTEXT_SUCCESS:
			// TODO: What to do on save?
			return state;
		case types.DELETE_CONTEXT_SUCCESS:
			// TODO: What to do on delete?
			return state;
		default:
			return state;
	}
}
