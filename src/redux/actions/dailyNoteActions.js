import * as types from './actionTypes';
import { beginApiCall, apiCallError } from './apiStatusActions';
import { getDailyNote, save, update } from '../../services/dailyNoteService';
export function loadNotesSuccess(tomatoes) {
	return { type: types.LOAD_NOTES_SUCCESS, tomatoes };
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
			.then((tomatoes) => {
				dispatch(loadNotesSuccess(tomatoes));
			})
			.catch((err) => {
				dispatch(apiCallError(err));
				throw err;
			});
	};
}

export function saveNotes(newTomato, token, userId) {
	return function (dispatch) {
		return save(newTomato, token, userId)
			.then((newTomato) => {
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
