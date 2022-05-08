export default {
	tomatoes: {
		current: undefined,
		recent: []
	},
	contexts: [],
	apiCallsInProgress: 0,
	selectedContext: null,
	tomatoTimer: {
		isRunning: false,
		// In seconds...
		time: 1500,
		workLength: 1500,
		shortBreakLength: 300,
		longBreakLength: 900
	},
	notes: {
		current: undefined,
		recent: []
	},
	todos: {}
};
