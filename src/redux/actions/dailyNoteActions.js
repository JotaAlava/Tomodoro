import * as types from './actionTypes';
import { beginApiCall, apiCallError } from './apiStatusActions';
import { getDailyNote, save, update } from '../../services/dailyNoteService';
import { toast } from 'react-toastify';

export function loadNotesSuccess(notes) {
	return { type: types.LOAD_NOTES_SUCCESS, notes };
}

export function saveNoteSuccess(newTomato) {
	return { type: types.SAVE_NOTES_SUCCESS, current: newTomato };
}

export function updateNoteSuccess() {
	return { type: types.UPDATE_NOTES_SUCCESS };
}

export function loadNotes(token, userId) {
	return function (dispatch) {
		dispatch(beginApiCall());
		return getDailyNote(token, userId)
			.then((notes) => {
				dispatch(loadNotesSuccess(notes));
				return notes;
			})
			.catch((err) => {
				dispatch(apiCallError(err));
				throw err;
			});
	};
}

export function saveNotes(newTomato, token, userId) {
	toast.info('Saving daily note...');
	return function (dispatch) {
		return save(newTomato, token, userId)
			.then((newTomato) => {
				toast.success('Daily note saved!');
				dispatch(saveNoteSuccess(newTomato));
			})
			.catch((err) => {
				dispatch(apiCallError(err));
				throw err;
			});
	};
}

export function updateNote(tomato, token) {
	return function (dispatch) {
		return update(tomato, token)
			.then((newTomato) => {
				dispatch(updateNoteSuccess(newTomato));
			})
			.catch((err) => {
				dispatch(apiCallError(err));
				throw err;
			});
	};
}
