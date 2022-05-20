import React from 'react';
import PropTypes from 'prop-types';

import TextInput from '../shared/TextInput';

const SettingsForm = ({ settings, handleChange, onSave }) => {
	const restoreDefaults = () => {
		settings.workLength = 1500;
		settings.shortBreakLength = 300;
		settings.longBreakLength = 900;

		onSave({
			preventDefault: () => {}
		});
	};

	return (
		<>
			<div className="justified-parent">
				<TextInput
					className="margin-right"
					label="Work Length"
					id="workLength"
					name="workLength"
					value={settings.workLength}
					onChange={handleChange}
				></TextInput>
				<TextInput
					className="margin-right"
					label="Short Break Length"
					id="shortBreakLength"
					name="shortBreakLength"
					value={settings.shortBreakLength}
					onChange={handleChange}
				></TextInput>
				<TextInput
					className="margin-right"
					label="Long Break Length"
					id="longBreakLength"
					name="longBreakLength"
					value={settings.longBreakLength}
					onChange={handleChange}
				></TextInput>
			</div>
			<button
				id="save_settings"
				className="btn btn-primary margin-top margin-right"
				onClick={onSave}
			>
				Save Settings
			</button>
			<button
				id="restore_settings"
				className="btn btn-primary margin-top"
				onClick={restoreDefaults}
			>
				Restore Default Settings
			</button>
		</>
	);
};

SettingsForm.propTypes = {
	settings: PropTypes.object.isRequired,
	handleChange: PropTypes.func.isRequired,
	onSave: PropTypes.func.isRequired
};

export default SettingsForm;
