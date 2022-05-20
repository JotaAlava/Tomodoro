import { toast } from 'react-toastify';

export const isSessionExpired = (err) => {
	return err.message === 'Unauthorized';
};

export const onSessionEnd = (err, logout) => {
	setTimeout(() => {
		if (isSessionExpired(err)) {
			toast.warn('Your session has ended.');
			logout();
		}
	}, 2000);
};

export const ga = (type, eventName, eventCategory, eventLabel) => {
	if (process.env.environment === 'prod') {
		// eslint-disable-next-line no-undef
		gtag(type, eventName, {
			event_category: eventCategory,
			event_label: eventLabel
		});
	}
};

export const EventType = {
	Event: 'event'
};

export const Label = {
	buildLabel: (detailed, sub) => {
		return `${detailed} for User: ${sub} on ${new Date().toUTCString()} (UTC) from ${
			Intl.DateTimeFormat().resolvedOptions().timeZone
		}`;
	}
};

export const Categories = {
	TIMER: 'Timer',
	TODO: 'TODOs',
	TOMATO: 'TOMATOs',
	CONTEXT: 'CONTEXTs',
	SETTINGS: 'SETTINGS',
	NOTES: 'NOTES',
	STARTUP: 'STARTUP',
	NAVIGATION: 'NAVIGATION'
};

export const EventNames = {
	STARTUP: 'react_app_started',
	TIMER: {
		TimerStart: 'timer_started',
		TimerStop: 'timer_stopped',
		TimerReset: 'timer_reset',
		TimerBreak: 'timer_short_break',
		TimerLongBreak: 'timer_short_break'
	},
	TODO: {
		saved: 'todo_saved'
	},
	NOTES: {
		saved: 'note_saved'
	},
	TOMATO: {
		saved: 'tomato_saved'
	},
	CONTEXT: {
		saved: 'context_saved'
	},
	SETTINGS: {
		saved: 'settings_saved',
		restore: 'settings_restore'
	},
	NAVIGATION: {
		work: 'entered_work_page',
		contexts: 'entered_contexts_page',
		about: 'entered_about_page',
		settings: 'entered_settings_page'
	}
};
