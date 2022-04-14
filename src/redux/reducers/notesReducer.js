import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function notesReducer(state = initialState.notes, action) {
	switch (action.type) {
		case types.SAVE_NOTE_SUCCESS:
			// TODO: Replace the note with the new note
			return { ...state, notes: action.note };
		case types.LOAD_NOTES_SUCCESS:
			return { ...state, notes: action.notes };
		case types.UPDATE_NOTE_SUCCESS:
			return state;
		default:
			return state;
	}
}
