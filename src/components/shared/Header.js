import React from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import LoginButton from './LoginButton';
import { useAuth0 } from '@auth0/auth0-react';

const Header = () => {
	const activeClass = 'nav-link active';
	const inActiveClass = 'nav-link';
	const { isAuthenticated } = useAuth0();
	const history = useHistory();

	const goHome = () => {
		history.push('/tomatoes');
	};

	return (
		<header className="contenedor fila spread-between">
			<h3 onClick={goHome}>Tomato Timer</h3>
			<div className="nav nav-masthead contenedor fila">
				<NavLink
					to="/tomatoes"
					className={inActiveClass}
					activeclass={activeClass}
				>
					Work
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
						Settings
					</NavLink>
				) : (
					<LoginButton></LoginButton>
				)}
			</div>
		</header>
	);
};

export default Header;
