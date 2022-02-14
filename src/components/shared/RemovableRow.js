import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const RemovableRow = (props) => {
	const index = 100;
	const [removeList, setRemoveList] = useState({});

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
					props.onConfirm(props.itemId);
				}}
			>
				Yep
			</a>{' '}
			<a
				href="#"
				onClick={() => {
					notSure(props.itemId);
				}}
			>
				Nah
			</a>
		</td>
	) : (
		<td key={index + props.itemId}>
			<a
				href="#"
				onClick={() => {
					areYouSure(props.itemId);
				}}
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
