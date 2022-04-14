import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { fontSize } from '../../shared/styles';

const ReAssignContext = (props) => {
	const index = 100;
	const [removeList, setRemoveList] = useState({});
	const font = fontSize;

	const areYouSure = () => {
		setRemoveList({
			...removeList,
			[props.itemId]: true
		});
	};

	const notSure = () => {
		setRemoveList({
			...removeList,
			[props.itemId]: false
		});
	};

	return removeList[props.itemId] ? (
		<td key={index + props.itemId}>
			<a
				href="#"
				onClick={() => {
					notSure();
					props.onConfirm(props.itemId);
				}}
				style={font}
			>
				Re-Assign
			</a>{' '}
			<a
				href="#"
				onClick={() => {
					notSure(props.itemId);
				}}
				style={font}
			>
				Do nothing
			</a>
		</td>
	) : (
		<td key={index + props.itemId}>
			<a
				href="#"
				onClick={() => {
					areYouSure(props.itemId);
				}}
				style={font}
			>
				Context
			</a>
		</td>
	);
};

ReAssignContext.propTypes = {
	contextId: PropTypes.number,
	onConfirm: PropTypes.func.isRequired
};

export default ReAssignContext;
