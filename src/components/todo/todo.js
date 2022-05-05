import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { useAuth0 } from '@auth0/auth0-react';
import { toast } from 'react-toastify';

import * as todoActions from '../../redux/actions/todoActions';
import TextInput from '../shared/TextInput';
import Title from '../shared/Title';
import Loading from '../shared/Loading';
import * as contextActions from '../../redux/actions/contextActions';

const Todo = (props) => {
	const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();
	const [todo, setTodo] = useState({ value: '' });
	const [errors, setErrors] = useState({});
	const [saving, setSaving] = useState(false);

	const loadTodos = async () => {
		setSaving(true);

		const token = await getAccessTokenSilently();

		props.todoActions.loadTodos(token, user.sub).then(() => {
			setSaving(false);
		});
	};

	useEffect(async () => {
		if (isAuthenticated) {
			loadTodos();
		}

		if (props.selectedContext) {
			const el = document.getElementById(
				'pills-home-tab' + props.selectedContext.tomatoContextId
			);

			if (!el.classList.contains('active')) {
				el.click();
			}
		}
	}, [props.selectedContext]);

	function handleChange(event) {
		const { name, value } = event.target;
		setTodo((prevTODOState) => ({
			...prevTODOState,
			[name]: value
		}));
	}

	async function handleSave(event) {
		event.preventDefault();
		setSaving(true);
		toast.info('Logging todo...');

		const token = await getAccessTokenSilently();
		const ctx = props.selectedContext.tomatoContextId;

		if (props.selectedContext.tomatoContextId > 0) {
			props.todoActions
				.saveTodo({ ...todo, tomatoContextId: ctx }, token, user.sub)
				.then(async () => {
					toast.success('Todo saved!');
					setErrors({});

					if (isAuthenticated) {
						setTodo((prevTODOState) => ({
							...prevTODOState,
							value: ''
						}));

						loadTodos();
					}
				})
				.catch((error) => {
					setSaving(false);
					setErrors({ onSave: error.result.message });
				});
		} else {
			toast.warning('Cannot log a todo without a work context.');
		}
	}

	const setCompleted = async (e, todo) => {
		toast.info('Completing todo...');
		setSaving(true);
		const token = await getAccessTokenSilently();
		const copyOfTodo = JSON.parse(JSON.stringify(todo));
		copyOfTodo.completed = !todo.completed;

		props.todoActions
			.updateTodo(copyOfTodo, token, user.sub)
			.then(() => {
				toast.success('Good job. Todo complete!');
				loadTodos();
			})
			.catch(() => {});
	};

	const deleteTodo = async (e, todo) => {
		toast.info('Removing todo...');
		setSaving(true);
		const token = await getAccessTokenSilently();

		props.todoActions
			.deleteTodo(todo._itemId, token)
			.then(() => {
				toast.success('Todo removed!');
				loadTodos();
			})
			.catch(() => {});
	};

	const selectContext = (ctxToSelect) => {
		props.context.selectContext(ctxToSelect);
	};

	return (
		<div className="relleno">
			<div id="Dropzone">Dropzone</div>
			<a draggable="true" href="#" id="Dragme">
				Drag Me
			</a>
			<Title text={'Todo'}></Title>
			<ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
				{props.contexts ? (
					props.contexts.map((ctx) => {
						return (
							<li
								className="nav-item"
								key={'todo-tab-' + ctx.tomatoContextId}
								role="presentation"
							>
								<button
									className="nav-link"
									id={'pills-home-tab' + ctx.tomatoContextId}
									data-bs-toggle="pill"
									data-bs-target={'#pills-home-' + ctx.tomatoContextId}
									type="button"
									role="tab"
									aria-controls="pills-home"
									aria-selected="true"
									onClick={() => {
										selectContext(ctx);
									}}
								>
									{ctx.label}
								</button>
							</li>
						);
					})
				) : (
					<p>No contexts.</p>
				)}
			</ul>

			<div className="tab-content" id="pills-tabContent">
				{props.selectedContext ? (
					<form onSubmit={handleSave} className="margin-top-small">
						{errors.onSave && (
							<div className="alert alert-danger" role="alert">
								{errors.onSave}
							</div>
						)}
						{saving ? (
							<Loading></Loading>
						) : (
							<TextInput
								id={'todo-input-' + todo.tomatoContextId}
								name="value"
								label={'TODOs'}
								value={todo.value}
								onChange={handleChange}
								error={errors.label}
								disabled={saving}
							/>
						)}
					</form>
				) : (
					<p>Select a work context to add TODOs</p>
				)}

				{props.contexts ? (
					props.contexts.map((ctx, i) => {
						return (
							<div
								key={ctx.label + '-todo-body-' + ctx.tomatoContextId + i}
								className="tab-pane fade show"
								id={'pills-home-' + ctx.tomatoContextId}
								role="tabpanel"
								aria-labelledby={'pills-home-tab' + ctx.tomatoContextId}
							>
								{saving ? (
									<></>
								) : (
									<div className="list-group margin-top">
										{props.todos
											.filter((todo) => {
												return (
													props.selectedContext !== null &&
													props.selectedContext.tomatoContextId ===
														todo.tomatoContextId
												);
											})
											.sort((a, b) => {
												const aFirst = -1;
												const bFirst = 1;
												const noChange = 0;

												if (a.completed === b.completed) {
													return noChange;
												} else if (a.completed && !b.completed) {
													return bFirst;
												} else if (!a.completed && b.completed) {
													return aFirst;
												} else if (!a.completed && !b.completed) {
													return noChange;
												} else {
													console.log('Something has gone terribly wrong!');
												}
											})
											.map((todo, id) => {
												return (
													<label
														key={'todo-row' + id}
														className="list-group-item align-items-center todo"
													>
														{todo.completed ? (
															<span
																className="form-check-input me-1 todo-checkbox todo-checked"
																onClick={(e) => {
																	setCompleted(e, todo);
																}}
															></span>
														) : (
															<span
																className="form-check-input me-1 todo-checkbox"
																onClick={(e) => {
																	setCompleted(e, todo);
																}}
															></span>
														)}

														<p className="todo-value">{todo.value}</p>

														{todo.completed ? (
															<span
																onClick={(e) => {
																	deleteTodo(e, todo);
																}}
																className="badge bg-warning rounded-pill pointer delete-todo"
															>
																X
															</span>
														) : (
															<></>
														)}
													</label>
												);
											})}
									</div>
								)}
							</div>
						);
					})
				) : (
					<p>No contexts.</p>
				)}
			</div>
		</div>
	);
};

Todo.propTypes = {
	context: PropTypes.object.isRequired,
	contexts: PropTypes.array,
	todos: PropTypes.array,
	selectedContext: PropTypes.object,
	todoActions: PropTypes.object
};

// This determines what part of the State we expose to the component
function mapStateToProps(state) {
	return {
		todos: state.todos,
		contexts: state.contexts,
		selectedContext: state.selectedContext
	};
}

// Map the call to dispatch into the props for cleaner dispatch
function mapDispatchToProps(dispatch) {
	return {
		todoActions: bindActionCreators(todoActions, dispatch),
		context: bindActionCreators(contextActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Todo);
