import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as contextActions from '../../redux/actions/contextActions';
import RemovableRow from '../shared/RemovableRow';
import { toast } from 'react-toastify';
import { useAuth0 } from '@auth0/auth0-react';
import Loading from '../shared/Loading';
import { fontSize, fontColor } from '../../shared/styles';

const ContextsList = ({ contexts, selectable, selectedContext, ...props }) => {
	const [errors, setErrors] = useState({});
	const [saving, setSaving] = useState(false);
	const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();

	const booleanToEnglish = (val) => {
		return val ? 'Yes' : 'No';
	};

	const select = (tomatoContextId) => {
		const newContextToSelect = contexts.find((ctx) => {
			return ctx.tomatoContextId === tomatoContextId;
		});

		if (
			selectedContext &&
			selectedContext.tomatoContextId === newContextToSelect.tomatoContextId
		) {
			props.actions.selectContext(null);
		} else {
			props.actions.selectContext(newContextToSelect);
		}
	};

	const isSelected = (tomatoContextId) => {
		if (
			selectedContext &&
			selectedContext.tomatoContextId === tomatoContextId
		) {
			return {
				backgroundColor: '#b3aa99'
			};
		} else {
			return {
				backgroundColor: 'transparent'
			};
		}
	};

	async function remove(contextItemId) {
		setSaving(true);

		const token = await getAccessTokenSilently();
		props.actions
			.deleteContext(contextItemId, token)
			.then(async () => {
				toast.success('Context removed!');
				setErrors({});
				if (isAuthenticated) {
					props.actions.loadContexts(token, user.sub).then(() => {
						setSaving(false);
					});
				}
			})
			.catch((error) => {
				setSaving(false);
				setErrors({ onSave: error.result.message });
			});
	}

	if (saving) {
		return <Loading></Loading>;
	} else {
		const className = 'text-wrap';
		const style = { width: '10rem' };
		const fonts = { color: fontColor.color, fontSize: fontSize.fontSize };

		return (
			<table className="table table-borderless" style={fonts}>
				<thead className="thead-dark">
					<tr>
						<th scope="col">Work Context</th>
						<th scope="col">Default</th>
						{/* <th scope="col">Shared</th> */}
					</tr>
				</thead>
				<tbody>
					{contexts.map((ctx) => {
						if (selectable) {
							return (
								<tr
									key={ctx.tomatoContextId}
									style={isSelected(ctx.tomatoContextId)}
								>
									<td className={className} style={style}>
										<Link to={'/contexts/' + ctx.tomatoContextId}>
											{ctx.label}
										</Link>
									</td>
									{/* <td>{booleanToEnglish(ctx.private)}</td> */}
									<td>{booleanToEnglish(ctx.default)}</td>
									<td>
										<button
											className="btn btn-primary"
											type="button"
											data-bs-dismiss="modal"
											aria-label="Close"
											onClick={() => select(ctx.tomatoContextId)}
										>
											Select
										</button>
									</td>
								</tr>
							);
						} else {
							return (
								<tr key={ctx.tomatoContextId}>
									<td className={className} style={style}>
										<Link to={'/contexts/' + ctx.tomatoContextId}>
											{ctx.label}
										</Link>
									</td>
									{/* <td>{booleanToEnglish(ctx.private)}</td> */}
									<td>{booleanToEnglish(ctx.default)}</td>
									<RemovableRow
										onConfirm={remove}
										itemId={ctx._itemId}
									></RemovableRow>
								</tr>
							);
						}
					})}
				</tbody>
			</table>
		);
	}
};

ContextsList.propTypes = {
	contexts: PropTypes.array.isRequired,
	selectable: PropTypes.bool,
	selectedContext: PropTypes.object,
	actions: PropTypes.object
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
		actions: bindActionCreators(contextActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(ContextsList);
