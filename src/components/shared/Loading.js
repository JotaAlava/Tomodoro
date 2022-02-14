import React from 'react';

const Loading = () => {
	return (
		<div className="row">
			<div className="col-12 text-center" role="status">
				<div className="spinner-border">
					<span className="visually-hidden">Loading...</span>
				</div>
			</div>
		</div>
	);
};

export default Loading;
