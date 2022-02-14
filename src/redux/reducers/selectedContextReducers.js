import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function contextReducer(
	state = initialState.selectedContext,
	action
) {
	switch (action.type) {
		case types.SELECT_CONTEXT:
			return action.selectedContext
				? JSON.parse(JSON.stringify(action.selectedContext))
				: null;
		default:
			return state;
	}
}
