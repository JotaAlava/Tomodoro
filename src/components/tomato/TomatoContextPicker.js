import React, { useState } from 'react';
import { connect } from 'react-redux';
import * as contextActions from '../../redux/actions/contextActions';
// Prop types helps us specify that props that our component accepts
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import Loading from '../shared/Loading';
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from '../shared/LoginButton';
import ContextsList from '../context/ContextsList';

const TomatoContextsPicker = (props) => {
	const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();
	const [loadingContexts, setLoadingContexts] = useState(false);

	const refreshContexts = async () => {
		const token = await getAccessTokenSilently();
		setLoadingContexts(true);
		props.context
			.loadContexts(token, user.sub)
			.then(() => {
				setLoadingContexts(false);
			})
			.catch((err) => {
				// Do nothing...
			});
	};

	if (isAuthenticated) {
		if (props.contexts.length > 0) {
			return (
				<div className="row">
					<div className="col-12">
						<h4>Select Context</h4>
					</div>
					<div className="col-12">
						<ContextsList
							contexts={props.contexts}
							selectable={true}
						></ContextsList>
					</div>
				</div>
			);
		} else if (props.contexts.length === 0) {
			if (loadingContexts) {
				return (
					<div className="row">
						<div className="col-12">
							<Loading></Loading>
						</div>
					</div>
				);
			} else {
				return (
					<div className="row">
						<div className="col-12">
							<h4>No contexts yet.</h4>
							<button
								type="button"
								className="btn btn-primary"
								onClick={() => refreshContexts()}
							>
								Refresh
							</button>
						</div>
					</div>
				);
			}
		} else {
			return <LoginButton></LoginButton>;
		}
	} else {
		return <LoginButton></LoginButton>;
	}
};

TomatoContextsPicker.propTypes = {
	// contexts: PropTypes.array.isRequired,
	actions: PropTypes.object.isRequired
};

// This determines what part of the State we expose to the component
// Runs every time the redux store state changes
function mapStateToProps(state) {
	return {
		apiCallsInProgress: state.apiCallsInProgress,
		contexts: state.contexts // This one is actually wired up to Redux
	};
}

// Map the call to dispatch into the props for cleaner dispatch
function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(contextActions, dispatch)
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(TomatoContextsPicker);
