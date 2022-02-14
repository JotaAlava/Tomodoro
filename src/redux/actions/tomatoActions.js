import * as types from './actionTypes';
import { beginApiCall, apiCallError } from '../actions/apiStatusActions';
import { getTomatoes, save, remove } from '../../services/tomatoService';

export function createTomato(tomato, token, userId) {
	const body = {
		tomato,
		token,
		userId
	};

	return { type: types.CREATE_TOMATO, body };
}

export function loadTomatoesSuccess(tomatoes) {
	return { type: types.LOAD_TOMATOES_SUCCESS, tomatoes };
}

export function saveTomatoSuccess(newTomato) {
	return { type: types.SAVE_TOMATO_SUCCESS, current: newTomato };
}

export function deleteTomatoSuccess() {
	return { type: types.DELETE_TOMATO_SUCCESS };
}

export function loadTomatoes(token, userId) {
	return function (dispatch) {
		dispatch(beginApiCall());
		return getTomatoes(token, userId)
			.then((tomatoes) => {
				dispatch(loadTomatoesSuccess(tomatoes));
			})
			.catch((err) => {
				dispatch(apiCallError(err));
				throw err;
			});
	};
}

export function saveTomato(newTomato, token, userId) {
	return function (dispatch) {
		return save(newTomato, token, userId)
			.then((newTomato) => {
				dispatch(saveTomatoSuccess(newTomato));
			})
			.catch((err) => {
				dispatch(apiCallError(err));
				throw err;
			});
	};
}

export function deleteTomato(tomatoItemId, token) {
	return function (dispatch) {
		return remove(tomatoItemId, token)
			.then((savedCtx) => {
				dispatch(deleteTomatoSuccess(savedCtx));
			})
			.catch((err) => {
				dispatch(apiCallError(err));
				throw err;
			});
	};
}
