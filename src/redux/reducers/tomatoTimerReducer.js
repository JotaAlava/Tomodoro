import * as types from '../actions/actionTypes';
import initialState from './initialState';

// In seconds...
const shortBreak = 300;
const longBreak = 900;

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
					time: initialState.tomatoTimer.time
				})
			);
		case types.START_SHORT_BREAK:
			return JSON.parse(
				JSON.stringify({
					...state,
					time: shortBreak
				})
			);
		case types.START_LONG_BREAK:
			return JSON.parse(
				JSON.stringify({
					...state,
					time: longBreak
				})
			);
		default:
			return state;
	}
}
