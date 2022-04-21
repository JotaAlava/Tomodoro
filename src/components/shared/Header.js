import React from 'react';
import { NavLink } from 'react-router-dom';
import LoginButton from './LoginButton';
import { useAuth0 } from '@auth0/auth0-react';

const Header = () => {
	const activeClass = 'nav-link active';
	const inActiveClass = 'nav-link';
	const { isAuthenticated } = useAuth0();

	return (
		<header className="masthead mb-auto">
			<div className="inner">
				<h3 className="masthead-brand">Tomodoro</h3>
				<nav className="nav nav-masthead justify-content-center">
					<NavLink
						to="/tomatoes"
						className={inActiveClass}
						activeclass={activeClass}
					>
						Tomatoes
					</NavLink>
					<NavLink
						to="/contexts"
						className={inActiveClass}
						activeclass={activeClass}
					>
						Work Contexts
					</NavLink>
					<NavLink
						to="/about"
						className={inActiveClass}
						activeclass={activeClass}
					>
						About
					</NavLink>
					{isAuthenticated ? (
						<NavLink
							to="/account"
							className={inActiveClass}
							activeclass={activeClass}
						>
							Account
						</NavLink>
					) : (
						<LoginButton></LoginButton>
					)}
				</nav>
			</div>
		</header>
	);
};

export default Header;
