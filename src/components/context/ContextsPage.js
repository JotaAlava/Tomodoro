import { useAuth0 } from '@auth0/auth0-react';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import * as contextActions from '../../redux/actions/contextActions';
// Prop types helps us specify that props that our component accepts
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import ContextsList from './ContextsList';
import Loading from '../shared/Loading';
import ReloadOnError from '../shared/ReloadOnError';
import ContextCreateButton from '../context/ContextCreateButton';
import { toast } from 'react-toastify';
import { onSessionEnd } from '../../services/utility';
import SignInMessage from '../shared/SignInMessage';

const ContextsPage = (props) => {
	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);
	const { isAuthenticated, getAccessTokenSilently, user, logout } = useAuth0();

	const warnIfMoreThanOneDefault = (contexts) => {
		let shouldWarn = 0;

		contexts.forEach((ctx) => {
			if (ctx.default) {
				shouldWarn++;
			}
		});

		if (shouldWarn > 1) {
			toast.warn(
				'Warning: More than one work context has been set as the default.'
			);
		}
	};

	const loadContexts = async () => {
		const token = await getAccessTokenSilently();

		if (user) {
			props.actions
				.loadContexts(token, user.sub)
				.then((res) => {
					warnIfMoreThanOneDefault(res);
					setLoading(false);
				})
				.catch((err) => {
					setErrors({ ...errors, contexts: err });
					onSessionEnd(err, logout);
				});
		}
	};

	useEffect(async () => {
		setLoading(true);
		loadContexts();
	}, [isAuthenticated]);

	const createContext = () => {
		props.history.push('/contexts/new');
	};

	if (props.loading) {
		return errors && errors.contexts ? (
			<ReloadOnError name={'contexts'} retry={loadContexts}></ReloadOnError>
		) : (
			<div className="other-page">
				<Loading></Loading>
			</div>
		);
	}
	if (isAuthenticated) {
		if (props.contexts.length === 0) {
			return loading ? (
				<div className="other-page">
					<Loading></Loading>
				</div>
			) : (
				<main role="main" className="inner cover other-page">
					<h1 className="cover-heading">Work Contexts</h1>
					<p className="lead">
						<ContextCreateButton onClick={createContext}></ContextCreateButton>
					</p>
					<p className="lead other-page">
						<h3>No contexts</h3>
					</p>
				</main>
			);
		} else {
			return loading ? (
				<div className="other-page">
					<Loading></Loading>
				</div>
			) : (
				<main role="main" className="inner cover other-page">
					<h1 className="cover-heading">Work Contexts</h1>
					<div className="lead">
						<ContextCreateButton onClick={createContext}></ContextCreateButton>
					</div>
					<div className="lead">
						<ContextsList contexts={props.contexts}></ContextsList>
					</div>
				</main>
			);
		}
	} else {
		return (
			<div className="other-page">
				<h2>Work Contexts</h2>
				<SignInMessage></SignInMessage>
			</div>
		);
	}
};

ContextsPage.propTypes = {
	contexts: PropTypes.array.isRequired,
	actions: PropTypes.object.isRequired,
	loading: PropTypes.bool.isRequired
};

// This determines what part of the State we expose to the component
function mapStateToProps(state) {
	return {
		contexts: state.contexts,
		loading: state.apiCallsInProgress > 0
	};
}

// Map the call to dispatch into the props for cleaner dispatch
function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(contextActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(ContextsPage);
