import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
// Prop types helps us specify that props that our component accepts
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { toast } from 'react-toastify';
import { useAuth0 } from '@auth0/auth0-react';

import * as contextActions from '../../redux/actions/contextActions';
import ContextForm from './ContextForm';
import Loading from '../shared/Loading';


const emptyCtx = {
	created: null,
	createdBy: null,
	default: false,
	label: '',
	private: true,
	deleted: false
};

const ContextsEdit = ({ match, contexts, actions, ...props }) => {
	const [context, setContext] = useState({ ...props.context });
	const [errors, setErrors] = useState({});
	const [saving, setSaving] = useState(false);
	const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();

	useEffect(async () => {
		setContext({ ...props.context });
	}, [props.context, isAuthenticated]);

	function handleChange(event) {
		const { name, value } = event.target;
		setContext((prevCtx) => ({
			...prevCtx,
			[name]:
				name === 'private' || name === 'default' ? event.target.checked : value
		}));
	}

	async function handleSave(event) {
		event.preventDefault();
		setSaving(true);
		toast.info('Creating work context!');

		const token = await getAccessTokenSilently();

		actions
			.saveContext(context, token, user.sub)
			.then(() => {
				toast.success('Context saved');
				props.history.push('/contexts');
			})
			.catch((error) => {
				setSaving(false);
				setErrors({ onSave: error.message });
			});
	}

	if (isAuthenticated) {
		if (contexts.length >= 0) {
			return (
				<>
					<ContextForm
						context={context}
						onChange={handleChange}
						onSave={handleSave}
						errors={errors}
						saving={saving}
					></ContextForm>
				</>
			);
		} else {
			return <Loading></Loading>;
		}
	} else {
		return (
			<>
				<h3>Please sign-in</h3>
			</>
		);
	}
};

ContextsEdit.propTypes = {
	match: PropTypes.object.isRequired,
	contexts: PropTypes.array.isRequired,
	actions: PropTypes.object.isRequired
};

function getContextById(contexts, id) {
	return contexts.find((ctx) => ctx.tomatoContextId === parseInt(id)) || null;
}

// This determines what part of the State we expose to the component
// Runs every time the redux store state changes
function mapStateToProps(state, ownProps) {
	const id = ownProps.match.params.id;
	const context =
		id && id != 'new' && state.contexts.length > 0
			? getContextById(state.contexts, id)
			: emptyCtx;

	return {
		contexts: state.contexts, // This one is actually wired up to Redux
		context
	};
}

// Map the call to dispatch into the props for cleaner dispatch
function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(contextActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(ContextsEdit);
