import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function tomatoTimerReducer(
	state = initialState.tomatoTimer,
	action
) {
	switch (action.type) {
		case types.START_TOMATO_TIMER:
			return JSON.parse(
				JSON.stringify({
					...state,
					isRunning: true
				})
			);
		case types.STOP_TOMATO_TIMER:
			return JSON.parse(
				JSON.stringify({
					...state,
					isRunning: false
				})
			);
		case types.TOMATO_TIMER_TICK_DOWN:
			return JSON.parse(
				JSON.stringify({
					...state,
					time: state.time - 1 <= 0 ? 0 : state.time - 1,
					isRunning: true
				})
			);
		case types.TOMATO_TIMER_RESET:
			return JSON.parse(
				JSON.stringify({
					...state,
					time: state.workLength
				})
			);
		case types.START_SHORT_BREAK:
			return JSON.parse(
				JSON.stringify({
					...state,
					time: state.shortBreakLength
				})
			);
		case types.START_LONG_BREAK:
			return JSON.parse(
				JSON.stringify({
					...state,
					time: state.longBreakLength
				})
			);
		case types.LOAD_SETTINGS_SUCCESS:
			return JSON.parse(
				JSON.stringify({
					...state,
					workLength: action.settings.workLength,
					shortBreakLength: action.settings.shortBreakLength,
					longBreakLength: action.settings.longBreakLength
				})
			);
		case types.SET_SETTINGS_SUCCESS:
			return JSON.parse(
				JSON.stringify({
					...state,
					workLength: action.settings.workLength,
					shortBreakLength: action.settings.shortBreakLength,
					longBreakLength: action.settings.longBreakLength
				})
			);
		case types.SAVE_SETTINGS_SUCCESS:
			console.log(action);
			return state;
		// return JSON.parse(
		// 	JSON.stringify({
		// 		...state,
		// 		workLength: action.settings.workLength,
		// 		shortBreakLength: action.settings.shortBreakLength,
		// 		longBreakLength: action.settings.longBreakLength
		// 	})
		// );
		default:
			return state;
	}
}
