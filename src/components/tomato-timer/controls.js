import { useAuth0 } from '@auth0/auth0-react';
import React, { useEffect, useRef, useState } from 'react';
import { useClockify } from './clockify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faPlay,
	faPause,
	faRedo,
	faCoffee
} from '@fortawesome/free-solid-svg-icons';
import * as tomatoTimerActions from '../../redux/actions/tomatoTimerActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import {
	ga,
	EventType,
	Label,
	Categories,
	EventNames
} from '../../services/utility';

const Controls = (props) => {
	const { user } = useAuth0();
	const [tomatoInterval, setTomatoInterval] = useState(false);

	useEffect(async () => {
		if (props.tomatoTimer.time === 0) {
			document.getElementById('beep').play();
		}

		if (props.tomatoTimer.time <= 0) {
			props.actions.stopTimer();
			clearInterval(tomatoInterval);
		}

		document.title = useClockify(props.tomatoTimer.time);
	}, [props.tomatoTimer.time]);

	// Custom Hook
	const bellSoundUrl =
		'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3';
	const audioSoundRef = useRef();

	const handleReset = () => {
		props.actions.resetTimer();
		handlePlayPause();

		const type = EventType.Event;
		const eventName = EventNames.TIMER.TimerReset;
		const eventLabel = Label.buildLabel(eventName, user.sub);
		const eventCategory = Categories.TIMER;

		ga(type, eventName, eventCategory, eventLabel);
	};

	const handlePlayPause = () => {
		if (!props.tomatoTimer.isRunning && props.tomatoTimer.time >= 0) {
			timerStart();

			const type = EventType.Event;
			const eventName = EventNames.TIMER.TimerStart;
			const eventLabel = Label.buildLabel(eventName, user.sub);
			const eventCategory = Categories.TIMER;

			ga(type, eventName, eventCategory, eventLabel);
		} else if (props.tomatoTimer.isRunning) {
			props.actions.stopTimer();
			clearInterval(tomatoInterval);

			const type = EventType.Event;
			const eventName = EventNames.TIMER.TimerStop;
			const eventLabel = Label.buildLabel(eventName, user.sub);
			const eventCategory = Categories.TIMER;

			ga(type, eventName, eventCategory, eventLabel);
		} else {
			// Do nothing because we are at 0 already.
			// User should click "reset" in order to reset the timer
			// Then start to start a new session
		}
	};

	const timerStart = () => {
		props.actions.startTimer();
		const interval = setInterval(() => {
			props.actions.tickDown();
		}, 1000);
		setTomatoInterval(interval);
	};

	const handleShortBreak = () => {
		props.actions.startShortBreak();
		clearInterval(tomatoInterval);
		timerStart();

		const type = EventType.Event;
		const eventName = EventNames.TIMER.TimerBreak;
		const eventLabel = Label.buildLabel(eventName, user.sub);
		const eventCategory = Categories.TIMER;

		ga(type, eventName, eventCategory, eventLabel);
	};

	const handleLongBreak = () => {
		props.actions.startLongBreak();
		clearInterval(tomatoInterval);
		timerStart();

		const type = EventType.Event;
		const eventName = EventNames.TIMER.TimerLongBreak;
		const eventLabel = Label.buildLabel(eventName, user.sub);
		const eventCategory = Categories.TIMER;

		ga(type, eventName, eventCategory, eventLabel);
	};

	return (
		<div className="controls__wrp">
			<button
				className="btn btn-primary"
				type="button"
				id="start_stop"
				onClick={handlePlayPause}
			>
				<FontAwesomeIcon
					icon={props.tomatoTimer.isRunning ? faPause : faPlay}
				/>
			</button>
			<button
				className="btn btn-primary"
				type="button"
				id="timer_reset"
				onClick={handleReset}
			>
				<FontAwesomeIcon id="timer_reset_svg" icon={faRedo} />
			</button>
			<button
				className="btn btn-warning"
				type="button"
				id="timer_short_break"
				onClick={handleShortBreak}
			>
				<FontAwesomeIcon
					id="timer_short_break_svg"
					icon={faCoffee}
					style={{ height: '15px' }}
				/>
			</button>
			<button
				className="btn btn-warning"
				type="button"
				id="timer_long_break"
				onClick={handleLongBreak}
			>
				<FontAwesomeIcon icon={faCoffee} style={{ height: '20px' }} />
			</button>
			<audio id="beep" src={bellSoundUrl} ref={audioSoundRef} preload="auto" />
		</div>
	);
};

Controls.propTypes = {
	actions: PropTypes.object.isRequired,
	tomatoTimer: PropTypes.object.isRequired
};

// This determines what part of the State we expose to the component
function mapStateToProps(state) {
	return {
		contexts: state.contexts,
		tomatoes: state.tomatoes,
		tomatoTimer: state.tomatoTimer
	};
}

// Map the call to dispatch into the props for cleaner dispatch
function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(tomatoTimerActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Controls);
