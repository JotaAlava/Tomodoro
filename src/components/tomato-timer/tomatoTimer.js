import React, { useEffect, useState } from 'react';
import Controls from './controls';
import { useClockify } from './clockify';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const TomatoTimer = (props) => {
	return (
		<div className="row timer">
			<h1 id="time-left" className="text-center">
				{useClockify(props.tomatoTimer.time)}
			</h1>

			<div className="col-12">
				{props.selectedContext ? (
					<h2 className="text-center">
						Work for {props.selectedContext.label}
					</h2>
				) : (
					<h2 className="text-center">No work context selected.</h2>
				)}
			</div>
			<div className="col-12 text-center">
				<Controls />
			</div>
		</div>
	);
};

TomatoTimer.propTypes = {
	selectedContext: PropTypes.object,
	tomatoTimer: PropTypes.object.isRequired
};

// This determines what part of the State we expose to the component
function mapStateToProps(state) {
	return {
		tomatoTimer: state.tomatoTimer,
		selectedContext: state.selectedContext
	};
}

// Map the call to dispatch into the props for cleaner dispatch
function mapDispatchToProps() {
	return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(TomatoTimer);
