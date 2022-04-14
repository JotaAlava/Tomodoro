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
import TomatoCreate from './TomatoCreate';
import RemovableRow from '../shared/RemovableRow';
import ReAssignContext from '../shared/ReAssignContext';
import { useAuth0 } from '@auth0/auth0-react';
import Loading from '../shared/Loading';
import TomatoTimer from '../tomato-timer/tomatoTimer';
import TomatoModal from '../tomato/TomatoModal';
import DailyNotes from '../notes/DailyNotes';
import Title from '../shared/Title';

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

	const assign = async (tomato) => {
		if (props.selectedContext === null) {
			toast.error('No context selected!');
		} else {
			const deepCopy = JSON.parse(JSON.stringify(tomato));
			deepCopy.tomatoContextId = props.selectedContext.tomatoContextId;

			const token = await getAccessTokenSilently();
			toast.info('Re-assigning...');
			props.tomato.updateTomato(deepCopy, token).then(() => {
				toast.success('Re-assigned!');
				loadTomatoes();
			});
		}
	};

	useEffect(async () => {
		if (isAuthenticated) {
			loadTomatoes();
			loadContexts();
		}
	}, [isAuthenticated]);

	if (isAuthenticated) {
		const className = 'text-wrap';
		const fontSize = fontSize;
		const descStyle = { ...fontSize, width: '20rem' };
		const dateStyle = { fontSize: 'small' };
		const sectionStyle = { minWidth: '60%' };
		const noteSectionStyle = { minWidth: '40%' };

		return (
			<div className="flex-row">
				<div className="parent">
					<div style={sectionStyle}>
						<main role="main" className="inner cover tomatoes">
							<Title text={'Tomato Timer'}></Title>
							<div className="lead">
								<TomatoTimer></TomatoTimer>
							</div>
							<div className="lead">
								<TomatoCreate></TomatoCreate>
							</div>
							<div className="lead">
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
										<div className="col-12 one-fold">
											{saving ? (
												<Loading></Loading>
											) : (
												<>
													<h2>Tomatoes</h2>
													<table
														className="table table-borderless"
														style={{ color: '#fff' }}
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

																		let result = tomatoesForDay.map(
																			(tomato) => {
																				return (
																					<tr key={tomato.tomatoId}>
																						<td className={className}>
																							<div
																								key={tomato.created}
																								style={dateStyle}
																							>
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
																			}
																		);

																		result.unshift(
																			<tr
																				key={keyIndex}
																				style={{ fontWeight: 'bold' }}
																			>
																				<td>
																					{props.tomatoes.recent[
																						keyName
																					][0].created.toLocaleDateString(
																						'en-US'
																					)}{' '}
																					(
																					{
																						props.tomatoes.recent[keyName]
																							.length
																					}
																					)
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
						</main>
					</div>
					<div style={noteSectionStyle}>
						<DailyNotes></DailyNotes>
					</div>
				</div>
			</div>
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
		selectedContext: state.selectedContext,
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
