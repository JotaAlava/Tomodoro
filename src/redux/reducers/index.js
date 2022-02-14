import { combineReducers } from 'redux';
import apiCallStatusReducer from './apiStatusReducer';
import contextReducer from './contextReducers';
import tomatoReducer from './tomatoReducers';
import selectedContextReducers from './selectedContextReducers';
import tomatoTimerReducer from './tomatoTimerReducer';

// This is where state gets combine into what gets passed as input to "mapStateToProps"
const rootReducer = combineReducers({
	tomatoes: tomatoReducer,
	contexts: contextReducer,
	apiCallsInProgress: apiCallStatusReducer,
	selectedContext: selectedContextReducers,
	tomatoTimer: tomatoTimerReducer
});

export default rootReducer;
