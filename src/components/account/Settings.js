import React, { useState, useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useAuth0 } from '@auth0/auth0-react';
import { toast } from 'react-toastify';

import initialState from '../../redux/reducers/initialState';
import SettingsForm from '../account/SettingsForm';
import Loading from '../shared/Loading';
import Title from '../shared/Title';
import * as settingsActions from '../../redux/actions/settingsActions';
import {
	onSessionEnd,
	ga,
	EventType,
	Label,
	Categories,
	EventNames
} from '../../services/utility';

const Settings = (props) => {
	const { isAuthenticated, getAccessTokenSilently, user, logout } = useAuth0();
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

					const type = EventType.Event;
					const eventName = EventNames.SETTINGS.saved;
					const eventLabel = Label.buildLabel(eventName, user.sub);
					const eventCategory = Categories.SETTINGS;

					ga(type, eventName, eventCategory, eventLabel);
				})
				.catch((error) => {
					setSaving(false);
					setErrors({ onSave: error.message });
					onSessionEnd(error, logout);

					const type = EventType.Event;
					const eventName = EventNames.SETTINGS.restore;
					const eventLabel = Label.buildLabel(eventName, user.sub);
					const eventCategory = Categories.SETTINGS;

					ga(type, eventName, eventCategory, eventLabel);
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
					onSessionEnd(error, logout);
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
						setSettings({
							workLength: initialState.tomatoTimer.workLength,
							shortBreakLength: initialState.tomatoTimer.shortBreakLength,
							longBreakLength: initialState.tomatoTimer.longBreakLength
						});
					}
				})
				.catch((err) => {
					onSessionEnd(err, logout);
				});
		}
	};

	useEffect(async () => {
		loadSettings();

		const type = EventType.Event;
		const eventName = EventNames.NAVIGATION.settings;
		const eventLabel = Label.buildLabel(eventName, user ? user.sub : 'no-user');
		const eventCategory = Categories.NAVIGATION;

		ga(type, eventName, eventCategory, eventLabel);
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
