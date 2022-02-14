import React from 'react';
import { NavLink } from 'react-router-dom';
import LoginButton from './LoginButton';
import { useAuth0 } from '@auth0/auth0-react';

const Header = () => {
	const activeStyle = { color: '#F1582A' };
	const { user, isAuthenticated, isLoading } = useAuth0();

	return (
		<nav>
			<NavLink to="/" activeStyle={activeStyle} exact>
				Home
			</NavLink>
			{' | '}
			<NavLink to="/tomatoes" activeStyle={activeStyle} exact>
				Tomatoes
			</NavLink>
			{' | '}
			<NavLink to="/contexts" activeStyle={activeStyle}>
				Contexts
			</NavLink>
			{' | '}
			<NavLink to="/about" activeStyle={activeStyle}>
				About
			</NavLink>
			{' | '}
			{isAuthenticated ? (
				<NavLink to="/account" activeStyle={activeStyle}>
					Account
				</NavLink>
			) : (
				<LoginButton></LoginButton>
			)}
		</nav>
	);
};

export default Header;
