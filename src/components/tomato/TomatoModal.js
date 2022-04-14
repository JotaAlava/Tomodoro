import React from 'react';
import TomatoContextsPicker from '../tomato/TomatoContextPicker';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const TomatoModal = (props) => {
	return (
		<>
			<button
				type="button"
				className="btn btn-primary"
				data-bs-toggle="modal"
				data-bs-target="#exampleModal"
			>
				{props.label}
			</button>

			<div
				className="modal fade"
				id="exampleModal"
				tabIndex="-1"
				aria-labelledby="exampleModalLabel"
				aria-hidden="true"
			>
				<div className="modal-dialog">
					<div
						className="modal-content"
						style={{
							backgroundColor: '#333'
						}}
					>
						<div className="modal-header">
							<h5 className="modal-title" id="exampleModalLabel">
								Contexts
							</h5>
							<button
								type="button"
								className="btn-close"
								data-bs-dismiss="modal"
								aria-label="Close"
							></button>
						</div>
						<div className="modal-body">
							<TomatoContextsPicker></TomatoContextsPicker>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

TomatoModal.propTypes = {
	label: PropTypes.string.isRequired
};

export default TomatoModal;
