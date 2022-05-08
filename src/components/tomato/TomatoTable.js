import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { useAuth0 } from '@auth0/auth0-react';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';

import * as tomatoActions from '../../redux/actions/tomatoActions';
import * as contextActions from '../../redux/actions/contextActions';
import TomatoModal from '../tomato/TomatoModal';
import ReloadOnError from '../shared/ReloadOnError';
import TomatoCreate from './TomatoCreate';
import RemovableRow from '../shared/RemovableRow';
import ReAssignContext from '../shared/ReAssignContext';
import Loading from '../shared/Loading';
import TomatoTimer from '../tomato-timer/tomatoTimer';
import Title from '../shared/Title';
import * as settingsActions from '../../redux/actions/settingsActions';
import { onSessionEnd } from '../../services/utility';

const TomatoesTable = (props) => {
	const [errors, setErrors] = useState({});
	const [loadingTomatoes, setLoadingTomatoes] = useState(true);
	const [loadingContexts, setLoadingContexts] = useState(true);
	const [saving, setSaving] = useState(false);
	const { isAuthenticated, getAccessTokenSilently, user, logout } = useAuth0();

	useEffect(async () => {
		if (isAuthenticated) {
			loadContexts();
			loadSettings();
			loadTomatoes();
		}
	}, [isAuthenticated]);

	const toContextLabel = (tomatoContextId) => {
		const result = props.contexts.find(
			(ctx) => ctx.tomatoContextId === tomatoContextId
		);

		return result && result.label ? result.label : 'No context';
	};

	const remove = async (tomatoId) => {
		setSaving(true);
		toast.info('Removing log...');

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
				onSessionEnd(error, logout);
			});
	};

	const loadSettings = async () => {
		const token = await getAccessTokenSilently();
		props.settings
			.loadSettings(token, user.sub)
			.then(() => {
				toast.info('Settings loaded');
			})
			.catch((err) => {
				onSessionEnd(err, logout);
			});
	};

	const loadContexts = async () => {
		const token = await getAccessTokenSilently();

		props.context
			.loadContexts(token, user.sub)
			.then((contexts) => {
				setLoadingContexts(false);

				// Select first work context that is set to default
				let ctxToSelect = undefined;
				contexts.forEach((ctx) => {
					if (ctx.default) {
						ctxToSelect = ctx;
					}
				});

				if (ctxToSelect) {
					props.context.selectContext(ctxToSelect);
				}
			})
			.catch((err) => {
				setErrors({ ...errors, contexts: err });
				onSessionEnd(err, logout);
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
				onSessionEnd(err, logout);
			});
	};

	const assign = async (tomato) => {
		if (props.selectedContext === null) {
			toast.error('No context selected!');
		} else {
			const deepCopy = JSON.parse(JSON.stringify(tomato));
			deepCopy.tomatoContextId = props.selectedContext.tomatoContextId;

			const token = await getAccessTokenSilently();
			toast.info('Re-assigning...');
			props.tomato
				.updateTomato(deepCopy, token)
				.then(() => {
					toast.success('Re-assigned!');
					loadTomatoes();
				})
				.catch((err) => {
					onSessionEnd(err, logout);
				});
		}
	};

	const className = 'text-wrap';
	const fontSize = fontSize;
	const descStyle = { ...fontSize };
	const dateStyle = { fontSize: 'small' };

	return (
		<>
			<Title text={'Work'}></Title>
			<div className="lead">
				<TomatoTimer></TomatoTimer>
			</div>
			<div className="lead">
				<TomatoCreate></TomatoCreate>
			</div>
			<div className="lead margin-top">
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
									<table
										className="table table-borderless"
										style={{ color: '#fff9ec' }}
									>
										<thead className="thead-dark">
											<tr>
												<th>Description</th>
												<th>Context</th>
												<th>Actions</th>
											</tr>
										</thead>
										<tbody>
											{Object.keys(props.tomatoes.recent).length > 0 ? (
												Object.keys(props.tomatoes.recent).map(
													(keyName, keyIndex) => {
														const tomatoesForDay =
															props.tomatoes.recent[keyName];

														let result = tomatoesForDay.map((tomato) => {
															return (
																<tr key={tomato.tomatoId}>
																	<td className={className}>
																		<div key={tomato.created} style={dateStyle}>
																			{' '}
																			{tomato.created.toLocaleTimeString(
																				'en-US'
																			)}
																		</div>
																		<div
																			key={tomato.description}
																			style={descStyle}
																		>
																			{' '}
																			{tomato.description}
																		</div>
																		<hr></hr>
																	</td>
																	<td>
																		<div
																			key={tomato.tomatoContextId}
																			style={fontSize}
																		>
																			{' '}
																			<TomatoModal
																				label={toContextLabel(
																					tomato.tomatoContextId
																				)}
																			></TomatoModal>
																		</div>
																	</td>
																	<RemovableRow
																		onConfirm={remove}
																		itemId={tomato._itemId}
																	></RemovableRow>
																	<ReAssignContext
																		onConfirm={() => assign(tomato)}
																		tomato={tomato}
																	></ReAssignContext>
																</tr>
															);
														});

														result.unshift(
															<tr
																key={keyIndex + keyName}
																style={{ fontWeight: 'bold' }}
															>
																<td>
																	{props.tomatoes.recent[
																		keyName
																	][0].created.toLocaleDateString('en-US')}{' '}
																	({props.tomatoes.recent[keyName].length})
																</td>
															</tr>
														);

														return result;
													}
												)
											) : (
												<tr>
													<td key={0}>No tomatoes.</td>
													<td key={1}>
														<div style={fontSize}>
															{' '}
															<TomatoModal
																label={toContextLabel(0)}
																tomato={undefined}
															></TomatoModal>
														</div>
													</td>
												</tr>
											)}
										</tbody>
									</table>
								</>
							)}
						</div>
					</div>
				)}
			</div>
		</>
	);
};

TomatoesTable.propTypes = {
	tomatoes: PropTypes.object.isRequired,
	tomato: PropTypes.object.isRequired,
	context: PropTypes.object.isRequired,
	selectedContext: PropTypes.object,
	settings: PropTypes.object,
	contexts: PropTypes.array.isRequired
};

// This determines what part of the State we expose to the component
function mapStateToProps(state) {
	return {
		contexts: state.contexts,
		selectedContext: state.selectedContext,
		tomatoes: state.tomatoes
	};
}

// Map the call to dispatch into the props for cleaner dispatch
function mapDispatchToProps(dispatch) {
	return {
		tomato: bindActionCreators(tomatoActions, dispatch),
		context: bindActionCreators(contextActions, dispatch),
		settings: bindActionCreators(settingsActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(TomatoesTable);
