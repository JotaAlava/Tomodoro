import React, { useState, useEffect } from 'react';
import TextInput from '../shared/TextInput';

const Settings = () => {
	return (
		<div>
			<h1>Settings</h1>
			<div className="justified-parent">
				<TextInput className="margin-right" label="Work Length"></TextInput>
				<TextInput
					className="margin-right"
					label="Short Break Length"
				></TextInput>
				<TextInput
					className="margin-right"
					label="Long Break Length"
				></TextInput>
			</div>
		</div>
	);
};

export default Settings;
