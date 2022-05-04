import React, { useState, useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useAuth0 } from '@auth0/auth0-react';
import { toast } from 'react-toastify';

import SettingsForm from '../account/SettingsForm';
import Loading from '../shared/Loading';
import Title from '../shared/Title';
import * as settingsActions from '../../redux/actions/settingsActions';

const Settings = (props) => {
	const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();
	const [settings, setSettings] = useState({ ...props.settings });
	const [saving, setSaving] = useState(false);
	const [error, setErrors] = useState(undefined);
	const [isNewSettings, setIsNewSettings] = useState(true);

	const saveSettings = async (event) => {
		event.preventDefault();
		setSaving(true);
		
		const token = await getAccessTokenSilently();
		if (isNewSettings) {
			toast.info('Creating settings!');
			props.settingsActions
				.saveSettings(settings, token, user.sub)
				.then(() => {
					loadSettings();
					toast.success('Settings saved');
				})
				.catch((error) => {
					setSaving(false);
					setErrors({ onSave: error.message });
				});
		} else {
			toast.info('Updating settings!');
			props.settingsActions
				.updateSettings(settings, token)
				.then(() => {
					loadSettings();
					toast.success('Settings updated');
				})
				.catch((error) => {
					setSaving(false);
					setErrors({ onSave: error.message });
				});
		}
	};

	const loadSettings = async () => {
		setSaving(true);
		const token = await getAccessTokenSilently();

		if (token) {
			props.settingsActions
				.loadSettings(token, user.sub)
				.then((settings) => {
					setSaving(false);
					if (
						settings &&
						settings.workLength >= 0 &&
						settings.shortBreakLength >= 0 &&
						settings.longBreakLength >= 0
					) {
						setIsNewSettings(false);
						setSettings(settings);
					} else {
						setIsNewSettings(true);
					}
				})
				.catch((e) => {
					console.log(e);
				});
		}
	};

	useEffect(async () => {
		loadSettings();
	}, [isAuthenticated]);

	function handleChange(event) {
		const { name, value } = event.target;
		setSettings((prevCtx) => ({
			...prevCtx,
			[name]: Number.parseInt(value)
		}));
	}

	return (
		<div>
			<Title text={'Settings'}></Title>

			{saving ? (
				<Loading></Loading>
			) : (
				<SettingsForm
					settings={settings}
					onSave={saveSettings}
					handleChange={handleChange}
				></SettingsForm>
			)}
		</div>
	);
};

Settings.propTypes = {
	settings: PropTypes.object.isRequired,
	settingsActions: PropTypes.object.isRequired
};

// This determines what part of the State we expose to the component
function mapStateToProps(state) {
	return {
		settings: state.tomatoTimer
	};
}

// Map the call to dispatch into the props for cleaner dispatch
function mapDispatchToProps(dispatch) {
	return {
		settingsActions: bindActionCreators(settingsActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
