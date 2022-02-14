export function useAuth0() {
	return {
		isAuthenticated: true,
		getAccessTokenSilently: () => 'token',
		user: {
			sub: 'sub'
		}
	};
}
