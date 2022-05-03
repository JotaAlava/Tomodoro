import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { fontSize } from '../../shared/styles';

const RemovableRow = (props) => {
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
				className="pseudo-link"
				onClick={() => {
					props.onConfirm(props.itemId);
				}}
				style={font}
			>
				Yep
			</a>{' '}
			<a
				className="pseudo-link"
				onClick={() => {
					notSure(props.itemId);
				}}
				style={font}
			>
				Nah
			</a>
		</td>
	) : (
		<td key={index + props.itemId}>
			<a
				className="pseudo-link"
				onClick={() => {
					areYouSure(props.itemId);
				}}
				style={font}
			>
				Remove
			</a>
		</td>
	);
};

RemovableRow.propTypes = {
	onConfirm: PropTypes.func.isRequired,
	itemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
};

export default RemovableRow;
