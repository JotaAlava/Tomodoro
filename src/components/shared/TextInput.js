import React from 'react';
import PropTypes from 'prop-types';
import { fontSize } from '../../shared/styles';

function TextInput(props) {
	let wrapperClass = 'form-group';
	if (props.error.length > 0) {
		wrapperClass += ' has-error';
	}

	return (
		<div className={wrapperClass}>
			<label htmlFor={props.id} style={fontSize}>
				{props.label}
			</label>
			<div className="field">
				<input
					id={props.id}
					type="text"
					onChange={props.onChange}
					name={props.name}
					className="form-control"
					value={props.value}
					disabled={props.disabled}
				/>
			</div>
			{props.error && <div className="alert alert-danger">{props.error}</div>}
		</div>
	);
}

TextInput.propTypes = {
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	error: PropTypes.string,
	disabled: PropTypes.bool
};

TextInput.defaultProps = {
	error: ''
};

export default TextInput;
