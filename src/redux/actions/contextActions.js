import * as types from './actionTypes';
import {
	getContexts,
	saveContext as save,
	remove
} from '../../services/contextService';
import { beginApiCall, apiCallError } from './apiStatusActions';

export function updateContext(context) {
	return { type: types.CREATE_CONTEXT, context };
}

export function createContext(context) {
	return { type: types.CREATE_CONTEXT, context };
}

export function saveContextSuccess(context) {
	return { type: types.SAVE_CONTEXT_SUCCESS, context };
}

export function deleteContextSuccess() {
	return { type: types.DELETE_CONTEXT_SUCCESS };
}

export function loadContextsSuccess(contexts) {
	return { type: types.LOAD_CONTEXTS_SUCCESS, contexts };
}

export function loadContextsById(id) {
	return { type: types.LOAD_CONTEXT_BY_ID, id };
}

export function selectContext(selectedContext) {
	return { type: types.SELECT_CONTEXT, selectedContext };
}

export function loadContexts(token, userId) {
	return function (dispatch) {
		dispatch(beginApiCall());
		return getContexts(token, userId)
			.then((contexts) => {
				dispatch(loadContextsSuccess(contexts));

				// Is this an anti-pattern for redux?
				return contexts;
			})
			.catch((err) => {
				dispatch(apiCallError(err));
				throw err;
			});
	};
}

export function saveContext(context, token, userId) {
	return function (dispatch) {
		return save(context, token, userId)
			.then((savedCtx) => {
				dispatch(saveContextSuccess(savedCtx));
			})
			.catch((err) => {
				dispatch(apiCallError(err));
				throw err;
			});
	};
}

export function deleteContext(contextItemId, token) {
	return function (dispatch) {
		return remove(contextItemId, token)
			.then((savedCtx) => {
				dispatch(deleteContextSuccess(savedCtx));
			})
			.catch((err) => {
				dispatch(apiCallError(err));
				throw err;
			});
	};
}
