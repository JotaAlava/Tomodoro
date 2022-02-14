import { useAuth0 } from '@auth0/auth0-react';

export default async function authenticationHook(friendID) {
	const { isAuthenticated, getAccessTokenSilently } = useAuth0();
	const token = await getAccessTokenSilently();

	return {
		isAuthenticated,
		token
	};
}
