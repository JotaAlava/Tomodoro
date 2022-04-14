import React from 'react';
import PropTypes from 'prop-types';

const Title = (props) => {
	return (
		<div className="row timer">
			<h1 id="time-left" className="text-center">
				{props.text}
			</h1>
		</div>
	);
};

Title.propTypes = {
	text: PropTypes.string.isRequired
};

export default Title;
