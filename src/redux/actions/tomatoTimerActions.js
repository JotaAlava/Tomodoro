import * as types from './actionTypes';
import { beginApiCall, apiCallError } from '../actions/apiStatusActions';
import { getTomatoes, save, remove } from '../../services/tomatoService';

export function startTimer() {
	return { type: types.START_TOMATO_TIMER };
}

export function stopTimer() {
	return { type: types.STOP_TOMATO_TIMER };
}

export function tickDown() {
	return { type: types.TOMATO_TIMER_TICK_DOWN };
}

export function resetTimer() {
	return { type: types.TOMATO_TIMER_RESET };
}

export function startShortBreak() {
	return { type: types.START_SHORT_BREAK };
}

export function startLongBreak() {
	return { type: types.START_LONG_BREAK };
}