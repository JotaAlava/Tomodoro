import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import LogoutButton from '../shared/LogoutButton';
import Loading from '../shared/Loading';

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
		return <Loading></Loading>;
	}

	if (isAuthenticated) {
		return (
			<>
				<div>
					<img src={user.picture} alt={user.name} />
					<h2>{user.name}</h2>
					<p>{user.email}</p>
				</div>
				<LogoutButton></LogoutButton>
			</>
		);
	} else {
		return (
			<>
				<div>
					<h2>Log in to see your account information.</h2>
				</div>
			</>
		);
	}
};

export default AccountPage;
