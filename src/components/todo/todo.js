import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { useAuth0 } from '@auth0/auth0-react';
import { toast } from 'react-toastify';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import * as todoActions from '../../redux/actions/todoActions';
import TextInput from '../shared/TextInput';
import Title from '../shared/Title';
import Loading from '../shared/Loading';
import * as contextActions from '../../redux/actions/contextActions';
import { onSessionEnd } from '../../services/utility';

const Todo = (props) => {
	const [state, setState] = useState({
		items: []
	});

	useEffect(async () => {
		setState({
			items: getItems(10)
		});
	}, []);

	const { isAuthenticated, getAccessTokenSilently, user, logout } = useAuth0();
	const [todo, setTodo] = useState({ value: '' });
	const [errors, setErrors] = useState({});
	const [saving, setSaving] = useState(false);

	const loadTodos = async () => {
		if (!saving) {
			setSaving(true);
			const token = await getAccessTokenSilently();

			props.todoActions
				.loadTodos(token, user.sub)
				.then(() => {
					setSaving(false);
				})
				.catch((err) => {
					onSessionEnd(err, logout);
				});
		}
	};

	useEffect(async () => {
		if (isAuthenticated) {
			loadTodos();
		}

		if (props.selectedContext || props.contexts.length === 1) {
			const cxtId =
				props.selectedContext === null
					? props.contexts[0].tomatoContextId
					: props.selectedContext.tomatoContextId;
			const el = document.getElementById('pills-home-tab' + cxtId);

			if (!el.classList.contains('active')) {
				el.click();
			}
		}
	}, [props.selectedContext, props.contexts]);

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
					onSessionEnd(error, logout);
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
			.catch((err) => {
				onSessionEnd(err, logout);
			});
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
			.catch((err) => {
				onSessionEnd(err, logout);
			});
	};

	const selectContext = (ctxToSelect) => {
		props.context.selectContext(ctxToSelect);
	};

	// a little function to help us with reordering the result
	const reorder = (list, startIndex, endIndex) => {
		const result = Array.from(list);
		const [removed] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, removed);

		return result;
	};

	const onDragEnd = (result) => {
		// dropped outside the list
		if (!result.destination) {
			return;
		}

		const reOrderedTodos = reorder(
			props.todos[props.selectedContext.tomatoContextId],
			result.source.index,
			result.destination.index
		);

		props.todoActions.setTodos(
			props.selectedContext.tomatoContextId,
			reOrderedTodos
		);
	};

	const getItemStyle = (isDragging, draggableStyle) => ({
		// some basic styles to make the items look a bit nicer
		userSelect: 'none',
		margin: `5px 0 5px 0`,
		border: '1px solid #ccc',

		// change background colour if dragging
		background: isDragging ? '#009574' : 'transparent',

		// styles we need to apply on draggables
		...draggableStyle
	});

	const getListStyle = (isDraggingOver) => ({
		background: isDraggingOver ? '#00cea8' : 'transparent'
	});

	const getItems = (count) =>
		Array.from({ length: count }, (v, k) => k).map((k) => ({
			id: `item-${k}`,
			content: `item ${k}`
		}));

	const safeTodosByCtx = (listOfTodos) => {
		return listOfTodos ? listOfTodos : [];
	};

	return (
		<div className="relleno">
			<Title text={'Selected Context'}></Title>

			<ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
				{props.contexts.length > 0 ? (
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

			<Title text={'Todo'}></Title>

			<div className="tab-content" id="pills-tabContent">
				{props.contexts.length > 0 ? (
					<form onSubmit={handleSave} className="margin-top-small">
						{errors.onSave && (
							<div className="alert alert-danger" role="alert">
								{errors.onSave}
							</div>
						)}
						{saving ? (
							<Loading></Loading>
						) : (
							<>
								{props.selectedContext !== null ? (
									<TextInput
										id={'todo-input-' + todo.tomatoContextId}
										name="value"
										label={'TODOs'}
										value={todo.value}
										onChange={handleChange}
										error={errors.label}
										disabled={saving}
									/>
								) : (
									<p>No contexts selected.</p>
								)}
							</>
						)}
					</form>
				) : (
					<>
						{props.contexts.length > 0 ? (
							<p>No contexts selected.</p>
						) : (
							<p>No contexts.</p>
						)}
					</>
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
									<DragDropContext onDragEnd={onDragEnd}>
										<Droppable droppableId="droppable">
											{(provided, snapshot) => (
												<div
													{...provided.droppableProps}
													ref={provided.innerRef}
													style={getListStyle(snapshot.isDraggingOver)}
													className="list-group margin-top"
												>
													{props.selectedContext ? (
														safeTodosByCtx(
															props.todos[props.selectedContext.tomatoContextId]
														).map((todo, index) => (
															<Draggable
																key={'draggable-id-' + index}
																draggableId={'draggable-id-' + index}
																index={index}
															>
																{(provided, snapshot) => (
																	<label
																		ref={provided.innerRef}
																		{...provided.draggableProps}
																		{...provided.dragHandleProps}
																		style={getItemStyle(
																			snapshot.isDragging,
																			provided.draggableProps.style
																		)}
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
																)}
															</Draggable>
														))
													) : (
														<></>
													)}
													{provided.placeholder}
												</div>
											)}
										</Droppable>
									</DragDropContext>
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
	todos: PropTypes.object,
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
