import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import * as tomatoActions from '../../redux/actions/tomatoActions';
import * as contextActions from '../../redux/actions/contextActions';
import { toast } from 'react-toastify';
// Prop types helps us specify that props that our component accepts
import SignInMessage from '../shared/SignInMessage';
import ReloadOnError from '../shared/ReloadOnError';
import TomatoContextsPicker from './TomatoContextPicker';
import TomatoCreate from './TomatoCreate';
import RemovableRow from '../shared/RemovableRow';
import { useAuth0 } from '@auth0/auth0-react';
import Loading from '../shared/Loading';
import TomatoTimer from '../tomato-timer/tomatoTimer';

const TomatoesPage = (props) => {
	const [errors, setErrors] = useState({});
	const [loadingTomatoes, setLoadingTomatoes] = useState(true);
	const [loadingContexts, setLoadingContexts] = useState(true);
	const [saving, setSaving] = useState(false);
	const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();

	const toContextLabel = (tomatoContextId) => {
		const result = props.contexts.find(
			(ctx) => ctx.tomatoContextId === tomatoContextId
		);

		return result && result.label ? result.label : 'No context';
	};

	const remove = async (tomatoId) => {
		setSaving(true);

		const token = await getAccessTokenSilently();
		props.tomato
			.deleteTomato(tomatoId, token)
			.then(async () => {
				toast.success('Tomato removed!');
				setErrors({});
				if (isAuthenticated) {
					props.tomato.loadTomatoes(token, user.sub).then(() => {
						setSaving(false);
					});
				}
			})
			.catch((error) => {
				setSaving(false);
				setErrors({ onSave: error.result.message });
			});
	};

	const loadContexts = async () => {
		const token = await getAccessTokenSilently();

		props.context
			.loadContexts(token, user.sub)
			.then(() => {
				setLoadingContexts(false);
			})
			.catch((err) => {
				setErrors({ ...errors, contexts: err });
			});
	};

	const loadTomatoes = async () => {
		const token = await getAccessTokenSilently();

		props.tomato
			.loadTomatoes(token, user.sub)
			.then(() => {
				setLoadingTomatoes(false);
			})
			.catch((err) => {
				setErrors({ ...errors, tomatoes: err });
			});
	};

	useEffect(async () => {
		if (isAuthenticated) {
			loadTomatoes();
			loadContexts();
		}
	}, [isAuthenticated]);

	if (isAuthenticated) {
		const className = 'text-wrap';
		const descStyle = { width: '20rem', fontSize: 'x-large' };
		const dateStyle = { fontSize: 'smaller' };
		return (
			<>
				<TomatoTimer></TomatoTimer>
				<TomatoCreate></TomatoCreate>
				{loadingContexts ? (
					errors.contexts ? (
						<ReloadOnError
							name={'contexts'}
							retry={loadContexts}
						></ReloadOnError>
					) : (
						<>
							<h4>Select Context</h4>
							<Loading></Loading>
						</>
					)
				) : (
					<TomatoContextsPicker></TomatoContextsPicker>
				)}
				<hr></hr>
				{loadingTomatoes ? (
					errors.tomatoes ? (
						<ReloadOnError
							name={'tomatoes'}
							retry={loadTomatoes}
						></ReloadOnError>
					) : (
						<>
							<h4>Tomatoes</h4>
							<Loading></Loading>
						</>
					)
				) : (
					<div className="row">
						<div className="col-12">
							{saving ? (
								<Loading></Loading>
							) : (
								<>
									<h2>Tomatoes</h2>
									<table className="table table-borderless">
										<thead className="thead-dark">
											<tr>
												<th>Description</th>
												<th>Context</th>
												<th></th>
											</tr>
										</thead>
										<tbody>
											{props.tomatoes.recent.length > 0 ? (
												props.tomatoes.recent.map((tomato) => {
													return (
														<tr key={tomato.tomatoId}>
															<td className={className}>
																<div key={tomato.created} style={dateStyle}>
																	{' '}
																	{tomato.created.toLocaleDateString(
																		'en-US'
																	)}{' '}
																	{tomato.created.toLocaleTimeString('en-US')}
																</div>
																<div key={tomato.description} style={descStyle}>
																	{' '}
																	{tomato.description}
																</div>
															</td>
															<td>
																<div key={tomato.tomatoContextId}>
																	{' '}
																	{toContextLabel(tomato.tomatoContextId)}
																</div>
															</td>
															<RemovableRow
																onConfirm={remove}
																itemId={tomato._itemId}
															></RemovableRow>
														</tr>
													);
												})
											) : (
												<tr>
													<td>No tomatoes.</td>
												</tr>
											)}
										</tbody>
									</table>
								</>
							)}
						</div>
					</div>
				)}
			</>
		);
	} else if (!isAuthenticated) {
		return <SignInMessage></SignInMessage>;
	}
};

TomatoesPage.propTypes = {
	tomatoes: PropTypes.object.isRequired,
	tomato: PropTypes.object.isRequired
};

// This determines what part of the State we expose to the component
function mapStateToProps(state) {
	return {
		contexts: state.contexts,
		tomatoes: state.tomatoes
	};
}

// Map the call to dispatch into the props for cleaner dispatch
function mapDispatchToProps(dispatch) {
	return {
		tomato: bindActionCreators(tomatoActions, dispatch),
		context: bindActionCreators(contextActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(TomatoesPage);
