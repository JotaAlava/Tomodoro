import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import * as tomatoActions from '../../redux/actions/tomatoActions';
// Prop types helps us specify that props that our component accepts
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import TextInput from '../shared/TextInput';
import { toast } from 'react-toastify';
import { useAuth0 } from '@auth0/auth0-react';
import SignInMessage from '../shared/SignInMessage';
import Loading from '../shared/Loading';

const emptyTomato = {
	created: null,
	description: '',
	tomatoContextId: null
};

const TomatoCreate = ({ selectedContext, actions }) => {
	const [tomato, setTomato] = useState(emptyTomato);
	const [errors, setErrors] = useState({});
	const [saving, setSaving] = useState(false);
	const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();

	useEffect(async () => {}, [selectedContext, isAuthenticated, saving, errors]);

	function handleChange(event) {
		const { name, value } = event.target;
		setTomato((prevTomatoState) => ({
			...prevTomatoState,
			[name]: value
		}));
	}

	async function handleSave(event) {
		event.preventDefault();
		setSaving(true);
		toast.info('Logging work...');

		const token = await getAccessTokenSilently();
		const ctx =
			selectedContext && selectedContext.tomatoContextId
				? selectedContext.tomatoContextId
				: 0;

		actions
			.saveTomato({ ...tomato, tomatoContextId: ctx }, token, user.sub)
			.then(async () => {
				toast.success('Tomato saved!');
				setErrors({});
				const token = await getAccessTokenSilently();
				if (isAuthenticated) {
					setTomato((prevTomatoState) => ({
						...prevTomatoState,
						description: ''
					}));

					actions.loadTomatoes(token, user.sub).then(() => {
						setSaving(false);
					});
				}
			})
			.catch((error) => {
				setSaving(false);
				setErrors({ onSave: error.result.message });
			});
	}

	if (isAuthenticated) {
		return (
			<form onSubmit={handleSave}>
				{errors.onSave && (
					<div className="alert alert-danger" role="alert">
						{errors.onSave}
					</div>
				)}
				{saving ? (
					<Loading></Loading>
				) : (
					<TextInput
						id="tomato"
						name="description"
						label="description"
						value={tomato.description}
						onChange={handleChange}
						error={errors.label}
						disabled={saving}
					/>
				)}
			</form>
		);
	} else {
		return <SignInMessage></SignInMessage>;
	}
};

TomatoCreate.propTypes = {
	selectedContext: PropTypes.object
};

// This determines what part of the State we expose to the component
// Runs every time the redux store state changes
function mapStateToProps(state) {
	return {
		selectedContext: state.selectedContext
	};
}

// Map the call to dispatch into the props for cleaner dispatch
function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(tomatoActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(TomatoCreate);
