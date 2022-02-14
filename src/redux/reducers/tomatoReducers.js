import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function tomatoReducer(state = initialState.tomatoes, action) {
	switch (action.type) {
		case types.CREATE_TOMATO:
			return { ...state, current: action.tomato };
		case types.LOAD_TOMATOES_SUCCESS:
			return { ...state, recent: action.tomatoes };
		case types.SAVE_TOMATO_SUCCESS:
			return state;
		case types.DELETE_TOMATO_SUCCESS:
			return state;
		default:
			return state;
	}
}

