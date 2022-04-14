import React from 'react';
import PropTypes from 'prop-types';
import { fontSize } from '../../shared/styles';

const BooleanInput = (props) => {
	let wrapperClass = 'form-group';
	if (props.error && props.error.length > 0) {
		wrapperClass += ' has-error';
	}

	function localChange(val) {
		console.log(val);
	}

	return (
		<div className={wrapperClass}>
			<label htmlFor={props.id} style={fontSize}>
				Label: {props.label} Value: {props.value}
			</label>
			<div className="field">
				<input
					id={props.id}
					type="checkbox"
					onChange={props.onChange}
					name={props.name}
					className="form-check-input"
					value={props.value}
					checked={props.value}
				/>
			</div>
			{props.error && <div className="alert alert-danger">{props.error}</div>}
		</div>
	);
};

BooleanInput.propTypes = {
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	value: PropTypes.bool,
	error: PropTypes.string
};

export default BooleanInput;
