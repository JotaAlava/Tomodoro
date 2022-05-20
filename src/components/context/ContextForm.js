import React, { useState } from 'react';
import PropTypes from 'prop-types';
import TextInput from '../shared/TextInput';
import BooleanInput from '../shared/BooleanInput';

const ContextForm = ({ context, onSave, onChange, saving = false, errors }) => {
	return (
		<section className="holy-grail-content">
			<form onSubmit={onSave}>
				<h2>
					{context && context.tomatoContextId ? 'Edit' : 'Add'} Work Context
				</h2>
				
				{errors.onSave && (
					<div className="alert alert-danger" role="alert">
						{errors.onSave}
					</div>
				)}

				<TextInput
					id="label"
					name="label"
					label="Label"
					value={context.label}
					onChange={onChange}
					error={errors.label}
				/>

				<BooleanInput
					id="default"
					name="default"
					label="default"
					value={context.default}
					onChange={onChange}
					error={errors.default}
				/>

				{saving}
				<button id="save_work_context" type="submit" disabled={saving} className="btn btn-primary">
					{saving ? 'Saving...' : 'Save'}
				</button>
			</form>
		</section>
	);
};

ContextForm.propTypes = {
	context: PropTypes.object.isRequired,
	onSave: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	saving: PropTypes.bool,
	errors: PropTypes.object.isRequired
};

export default ContextForm;
