import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import LogoutButton from '../shared/LogoutButton';
import Loading from '../shared/Loading';
import Settings from './Settings';

const AccountPage = () => {
	const { user, isAuthenticated, isLoading } = useAuth0();
	const [token, setToken] = useState('initial');
	const all = useAuth0();

	useEffect(async () => {
		if (isAuthenticated) {
			setToken(await all.getAccessTokenSilently());
		}
	}, [isAuthenticated]);

	if (isLoading) {
		return (
			<section className="holy-grail-content">
				<Loading></Loading>
			</section>
			// <div className="other-page">
			// 	<Loading></Loading>
			// </div>
		);
	}

	if (isAuthenticated) {
		return (
			<>
				<section className="holy-grail-content">
					<Settings></Settings>
					<hr></hr>
					<h1>Account</h1>
					<img src={user.picture} alt={user.name} />
					<h1>{user.name}</h1>
					<div>
						Username: <p>{user.email}</p>
					</div>
					<LogoutButton></LogoutButton>
				</section>
				{/* <main role="main" className="inner cover other-page">
					
				</main> */}
			</>
		);
	} else {
		return (
			<>
				<section className="holy-grail-content">
					<h2>Log in to see your account information.</h2>
				</section>
				{/* <div className="other-page"></div> */}
			</>
		);
	}
};

export default AccountPage;
