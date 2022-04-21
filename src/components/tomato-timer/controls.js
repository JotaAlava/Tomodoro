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

const Controls = (props) => {
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
	};

	const handlePlayPause = () => {
		if (!props.tomatoTimer.isRunning && props.tomatoTimer.time >= 0) {
			timerStart();
		} else if (props.tomatoTimer.isRunning) {
			props.actions.stopTimer();
			clearInterval(tomatoInterval);
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
	};

	const handleLongBreak = () => {
		props.actions.startLongBreak();
		clearInterval(tomatoInterval);
		timerStart();
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
				id="reset"
				onClick={handleReset}
			>
				<FontAwesomeIcon icon={faRedo} />
			</button>
			<button
				className="btn btn-warning"
				type="button"
				id="reset"
				onClick={handleShortBreak}
			>
				<FontAwesomeIcon icon={faCoffee} />
			</button>
			<button
				className="btn btn-warning"
				type="button"
				id="reset"
				onClick={handleLongBreak}
			>
				<FontAwesomeIcon icon={faCoffee} />
				<FontAwesomeIcon icon={faCoffee} />
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
