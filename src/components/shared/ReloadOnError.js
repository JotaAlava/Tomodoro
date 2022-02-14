import React from 'react';
import PropTypes from 'prop-types';

const ReloadOnError = (props) => {
	return (
		<>
			<p>Could not load {props.name}.</p>
			<button className="btn btn-primary" onClick={() => props.retry()}>
				Try Again
			</button>
		</>
	);
};

ReloadOnError.propTypes = {
	name: PropTypes.string.isRequired,
	retry: PropTypes.func.isRequired
};

export default ReloadOnError;
