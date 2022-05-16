import * as types from './actionTypes';
import { load, save, update } from '../../services/settingsService';
import { beginApiCall, apiCallError } from './apiStatusActions';
import initialState from '../../redux/reducers/initialState';

export function updateTodoSuccess(settings) {
	return { type: types.UPDATE_TODO_SUCCESS, todo: settings };
}

export function setSettingsSuccess(settings) {
	return { type: types.SET_SETTINGS_SUCCESS, settings };
}

export function saveSettingsSuccess(settings) {
	return { type: types.SAVE_SETTINGS_SUCCESS, settings };
}

export function loadSettingsSuccess(settings) {
	return { type: types.LOAD_SETTINGS_SUCCESS, settings };
}

export function loadSettings(token, userId) {
	return function (dispatch) {
		dispatch(beginApiCall());
		return load(token, userId)
			.then((settings) => {
				let settingsToUse = {};
				// If no settings, then use defaults
				if (
					settings &&
					settings.workLength &&
					settings.shortBreakLength &&
					settings.longBreakLength
				) {
					settingsToUse = settings;
				} else {
					settingsToUse = {
						workLength: initialState.tomatoTimer.workLength,
						shortBreakLength: initialState.tomatoTimer.shortBreakLength,
						longBreakLength: initialState.tomatoTimer.longBreakLength
					};
				}

				dispatch(loadSettingsSuccess(settingsToUse));
				// Is this an anti-pattern for redux?
				return settings;
			})
			.catch((err) => {
				dispatch(apiCallError(err));
				throw err;
			});
	};
}

export function setSettings(settings) {
	return function (dispatch) {
		dispatch(setSettingsSuccess(settings));
	};
}

export function saveSettings(settings, token, userId) {
	return function (dispatch) {
		return save(settings, token, userId)
			.then((savedSettings) => {
				dispatch(saveSettingsSuccess(savedSettings));
			})
			.catch((err) => {
				dispatch(apiCallError(err));
				throw err;
			});
	};
}

export function updateSettings(settings, token) {
	return function (dispatch) {
		return update(settings, token)
			.then((updatedSettings) => {
				dispatch(saveSettingsSuccess(updatedSettings));
			})
			.catch((err) => {
				dispatch(apiCallError(err));
				throw err;
			});
	};
}
