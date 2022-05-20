import React from 'react';
import LoginButton from './LoginButton';

const SignInMessage = () => {
	return (
		<div className="row other-page">
			<div className="col-12 text-center" role="status">
				<p>You need to log-in.</p>
				<LoginButton></LoginButton>
			</div>
		</div>
	);
};

export default SignInMessage;
